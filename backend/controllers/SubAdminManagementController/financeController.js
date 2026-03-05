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

const mapEmiSchedule = (emiDates = []) => {
	return emiDates.map((schedule, index) => {
		const emiValue = Number(schedule?.amount || 0);
		const paidAmount = Number(schedule?.paidAmount || 0);
		const pendingAmount = Math.max(emiValue - paidAmount, 0);

		return {
			sno: Number(schedule?.emiNo || index + 1),
			emi: emiValue,
			paidAmount,
			emiDate: formatDisplayDate(schedule?.emiDate),
			paidDate: formatDisplayDate(schedule?.paidDate),
			pendingAmount,
			peningAmount: pendingAmount,
		};
	});
};

const mapBuyerToFinanceStatement = (buyer) => {
	const finance = buyer?.finance || {};
	const vehicle = buyer?.vehicle || {};
	const guarantor = buyer?.guarantor || {};
	const emiSchedule = mapEmiSchedule(finance?.emiDates || []);
	const totalPaid = emiSchedule.reduce((sum, item) => sum + Number(item?.paidAmount || 0), 0);
	const totalPending = emiSchedule.reduce(
		(sum, item) => sum + Number(item?.pendingAmount || 0),
		0
	);

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
