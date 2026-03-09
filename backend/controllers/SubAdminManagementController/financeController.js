import Buyer from "../../models/buyerModel.js";

const formatDisplayDate = (value) => {
	if (!value) return "";
	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) return "";

	const day = String(parsedDate.getDate()).padStart(2, "0");
	const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
	const year = parsedDate.getFullYear();
	return `${day}-${month}-${year}`;
};

const calculateAge = (dateOfBirth) => {
	if (!dateOfBirth) return "";
	const dob = new Date(dateOfBirth);
	if (Number.isNaN(dob.getTime())) return "";

	const today = new Date();
	let age = today.getFullYear() - dob.getFullYear();
	const monthDiff = today.getMonth() - dob.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
		age -= 1;
	}
	return age;
};

const calculateEmiProgress = (emiDates = []) => {
	let carryForward = 0;

	return emiDates.map((schedule, index) => {
		const emiValue = Number(schedule?.amount || 0);
		const paidAmount = Number(schedule?.paidAmount || 0);
		const availableAmount = paidAmount + carryForward;
		const pendingAmount = Math.max(emiValue - availableAmount, 0);
		carryForward = Math.max(availableAmount - emiValue, 0);

		return {
			schedule,
			index,
			emiValue,
			paidAmount,
			pendingAmount,
			carryForward,
		};
	});
};

const mapEmiSchedule = (emiDates = []) => {
	const emiProgress = calculateEmiProgress(emiDates);

	return emiProgress.map((item) => {
		const { schedule, index, emiValue, paidAmount, pendingAmount } = item;

		return {
			sno: Number(schedule?.emiNo || index + 1),
			emi: emiValue,
			paidAmount,
			emiDate: formatDisplayDate(schedule?.emiDate),
			paidDate: formatDisplayDate(schedule?.paidDate),
			bookNo: schedule?.bookNo || "",
			pageNo: schedule?.pageNo || "",
			pendingAmount,
			peningAmount: pendingAmount,
		};
	});
};

const mapPaymentEntries = (paymentEntries = []) => {
	if (!Array.isArray(paymentEntries)) return [];

	return paymentEntries.map((entry) => ({
		paidDate: formatDisplayDate(entry?.paidDate),
		amount: Number(entry?.amount || 0),
		bookNo: entry?.bookNo || "",
		pageNo: entry?.pageNo || "",
		emiNo: Number(entry?.emiNo || 0),
	}));
};

const normalizeText = (value) => String(value || "").trim();

const toStartOfDay = (value) => {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return null;
	parsed.setHours(0, 0, 0, 0);
	return parsed;
};

const resolveTargetEmiIndex = (emiDates = [], paymentDate) => {
	if (!Array.isArray(emiDates) || emiDates.length === 0) return -1;
	const emiProgress = calculateEmiProgress(emiDates);

	const dayValue = paymentDate ? paymentDate.getTime() : null;
	if (dayValue !== null) {
		const exactMatchIndex = emiProgress.findIndex((progressItem) => {
			const dueDate = toStartOfDay(progressItem?.schedule?.emiDate);
			return dueDate && dueDate.getTime() === dayValue;
		});

		if (exactMatchIndex >= 0) return exactMatchIndex;
	}

	return emiProgress.findIndex((progressItem) => Number(progressItem?.pendingAmount || 0) > 0);
};

const mapBuyerToFinanceStatement = (buyer) => {
	const finance = buyer?.finance || {};
	const vehicle = buyer?.vehicle || {};
	const guarantor = buyer?.guarantor || {};
	const emiSchedule = mapEmiSchedule(finance?.emiDates || []);
	const paymentEntries = mapPaymentEntries(finance?.paymentEntries || []);
	const totalInstalmentAmount = emiSchedule.reduce((sum, item) => sum + Number(item?.emi || 0), 0);
	const totalPaid = paymentEntries.length > 0
		? paymentEntries.reduce((sum, entry) => sum + Number(entry?.amount || 0), 0)
		: emiSchedule.reduce((sum, item) => sum + Number(item?.paidAmount || 0), 0);
	const totalPending = Math.max(totalInstalmentAmount - totalPaid, 0);

	const financeAmount = Number(finance?.financeAmount || 0);
	const emiAmount = Number(finance?.emiAmount || 0);
	const emiMonths = Number(finance?.months || emiSchedule.length || 0);
	const charges = Math.abs(financeAmount - emiAmount * emiMonths);
	const totalAmount = financeAmount + charges;

	return {
		id: String(buyer?._id),
		seller: buyer?.name || "",
		buyerName: buyer?.name || "",
		vehicle: vehicle?.vehicleNumber || "",
		phoneNo: buyer?.phoneNo || "",
		financeAmount,
		emiDate: formatDisplayDate(finance?.emiStartDate || finance?.emiDate),
		emi: emiAmount,
		age: calculateAge(buyer?.dateOfBirth),
		address: buyer?.fullAddress || "",
		agreementNo: buyer?.agreementNo || "",
		vehiclePrice: Number(vehicle?.bikePrice || 0),
		charges,
		totalAmount,
		emiSchedule,
		paymentEntries,
		totalPaid,
		totalPending,
		vehicleName: vehicle?.vehicleName || "",
		chassisNo: vehicle?.chassisNo || "",
		vehicleModel: vehicle?.model || "",
		months: emiMonths,
		guarantorName: guarantor?.fullName || "",
		guarantorAge: calculateAge(guarantor?.dateOfBirth),
		guarantorPhoneNo: guarantor?.phoneNo || "",
		guarantorAddress: guarantor?.address || "",
		partyPhoto: buyer?.profile || "",
		guarantorPhoto: guarantor?.guarantorPhoto || "",
		status: finance?.status || "pending",
	};
};

export const getFinanceList = async (req, res) => {
	try {
		const { search = "", page = 1, limit = 10, status = "all", from = "", to = "" } = req.query;

		const parsedPage = Math.max(1, Number.parseInt(page, 10) || 1);
		const parsedLimit = Math.max(1, Number.parseInt(limit, 10) || 10);
		const trimmedSearch = String(search || "").trim();
		const selectedStatus = String(status || "all").toLowerCase();

		const query = {
			"finance.financeAmount": { $gt: 0 },
		};

		if (trimmedSearch) {
			query.$or = [
				{ name: { $regex: trimmedSearch, $options: "i" } },
				{ agreementNo: { $regex: trimmedSearch, $options: "i" } },
				{ phoneNo: { $regex: trimmedSearch, $options: "i" } },
				{ "vehicle.vehicleNumber": { $regex: trimmedSearch, $options: "i" } },
			];
		}

		if (selectedStatus === "completed") {
			query["finance.status"] = "paid";
		} else if (selectedStatus === "active") {
			query["finance.status"] = { $ne: "paid" };
		}

		if (from || to) {
			query["finance.emiDate"] = {};
			if (from) {
				const fromDate = new Date(from);
				if (!Number.isNaN(fromDate.getTime())) {
					query["finance.emiDate"].$gte = fromDate;
				}
			}
			if (to) {
				const toDate = new Date(to);
				if (!Number.isNaN(toDate.getTime())) {
					toDate.setHours(23, 59, 59, 999);
					query["finance.emiDate"].$lte = toDate;
				}
			}
			if (Object.keys(query["finance.emiDate"]).length === 0) {
				delete query["finance.emiDate"];
			}
		}

		const totalRecords = await Buyer.countDocuments(query);
		const totalPages = Math.max(1, Math.ceil(totalRecords / parsedLimit));
		const safePage = Math.min(parsedPage, totalPages);
		const skip = (safePage - 1) * parsedLimit;

		const buyers = await Buyer.find(query)
			.select("name agreementNo phoneNo fullAddress dateOfBirth vehicle finance guarantor profile")
			.sort({ _id: -1 })
			.skip(skip)
			.limit(parsedLimit)
			.lean();

		const data = buyers.map(mapBuyerToFinanceStatement);

		return res.status(200).json({
			success: true,
			message: "Finance list fetched successfully",
			data,
			pagination: {
				page: safePage,
				limit: parsedLimit,
				totalRecords,
				totalPages,
				hasPrev: safePage > 1,
				hasNext: safePage < totalPages,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch finance list",
			error: error.message,
		});
	}
};

export const getFinanceStatement = async (req, res) => {
	try {
		const { buyerId } = req.params;

		const buyer = await Buyer.findById(buyerId)
			.select("name agreementNo phoneNo fullAddress dateOfBirth vehicle finance guarantor profile")
			.lean();

		if (!buyer) {
			return res.status(404).json({
				success: false,
				message: "Finance record not found",
			});
		}

		const statement = mapBuyerToFinanceStatement(buyer);

		return res.status(200).json({
			success: true,
			message: "Finance statement fetched successfully",
			data: statement,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch finance statement",
			error: error.message,
		});
	}
};

export const createEmiEntry = async (req, res) => {
	try {
		const { agreementNo, date, amount, bookNo = "", pageNo = "" } = req.body || {};

		const trimmedAgreementNo = normalizeText(agreementNo);
		if (!trimmedAgreementNo) {
			return res.status(400).json({
				success: false,
				message: "agreementNo is required",
			});
		}

		const paidAmount = Number(amount);
		if (Number.isNaN(paidAmount) || paidAmount <= 0) {
			return res.status(400).json({
				success: false,
				message: "amount must be a valid number greater than 0",
			});
		}

		const paymentDate = toStartOfDay(date || new Date());
		if (!paymentDate) {
			return res.status(400).json({
				success: false,
				message: "date is invalid",
			});
		}

		const buyer = await Buyer.findOne({ agreementNo: trimmedAgreementNo });
		if (!buyer) {
			return res.status(404).json({
				success: false,
				message: "Buyer not found for this agreement number",
			});
		}

		if (!Array.isArray(buyer?.finance?.emiDates) || buyer.finance.emiDates.length === 0) {
			return res.status(400).json({
				success: false,
				message: "No EMI schedule found for this agreement",
			});
		}

		const emiDates = buyer.finance.emiDates;
		const targetIndex = resolveTargetEmiIndex(emiDates, paymentDate);
		const hasPendingInstalment = targetIndex >= 0;

		let targetEmi = null;
		if (hasPendingInstalment) {
			targetEmi = emiDates[targetIndex];
			targetEmi.paidDate = paymentDate;
			targetEmi.paidAmount = Number(targetEmi?.paidAmount || 0) + paidAmount;
			targetEmi.bookNo = normalizeText(bookNo);
			targetEmi.pageNo = normalizeText(pageNo);

			const emiDueAmount = Number(targetEmi?.amount || 0);
			targetEmi.paid = emiDueAmount > 0 ? targetEmi.paidAmount >= emiDueAmount : targetEmi.paidAmount > 0;
		}

		if (!Array.isArray(buyer.finance.paymentEntries)) {
			buyer.finance.paymentEntries = [];
		}

		const nextEntryEmiNo = hasPendingInstalment
			? Number(targetEmi?.emiNo || targetIndex + 1)
			: buyer.finance.paymentEntries.length + 1;

		buyer.finance.paymentEntries.push({
			paidDate: paymentDate,
			amount: paidAmount,
			bookNo: normalizeText(bookNo),
			pageNo: normalizeText(pageNo),
			emiNo: nextEntryEmiNo,
		});

		const emiProgress = calculateEmiProgress(buyer.finance.emiDates || []);
		const allPaid = emiProgress.every((item) => Number(item?.pendingAmount || 0) <= 0);

		buyer.finance.status = allPaid ? "paid" : "pending";
		await buyer.save();

		return res.status(200).json({
			success: true,
			message: "EMI entry saved successfully",
			data: {
				buyerId: String(buyer._id),
				agreementNo: buyer.agreementNo,
				emiNo: nextEntryEmiNo,
				paidDate: formatDisplayDate(hasPendingInstalment ? targetEmi?.paidDate : paymentDate),
				paidAmount: hasPendingInstalment ? Number(targetEmi.paidAmount || 0) : paidAmount,
				bookNo: normalizeText(bookNo),
				pageNo: normalizeText(pageNo),
				entryType: hasPendingInstalment ? "instalment" : "extra-payment",
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to save EMI entry",
			error: error.message,
		});
	}
};
