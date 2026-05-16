import Buyer from "../../models/buyerModel.js";
import SubAdmin from "../../models/subAdminModel.js";
import CollectionEntry from "../../models/collectionEntryModel.js";
import { getSignedImageUrl } from "../../utils/s3Upload.js";

const formatDisplayDate = (value) => {
	if (!value) return "";
	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) return "";

	const day = String(parsedDate.getDate()).padStart(2, "0");
	const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
	const year = parsedDate.getFullYear();
	return `${day}-${month}-${year}`;
};

const parseDateOfBirth = (value) => {
	if (!value) return null;

	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? null : value;
	}

	const raw = String(value).trim();
	if (!raw) return null;

	// Handles ISO date formats first.
	const directParsed = new Date(raw);
	if (!Number.isNaN(directParsed.getTime())) return directParsed;

	// Handles dd-mm-yyyy and dd/mm/yyyy formats.
	const match = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
	if (!match) return null;

	const day = Number(match[1]);
	const month = Number(match[2]);
	const year = Number(match[3]);
	const parsed = new Date(year, month - 1, day);
	if (Number.isNaN(parsed.getTime())) return null;
	return parsed;
};

const calculateAge = (dateOfBirth) => {
	const dob = parseDateOfBirth(dateOfBirth);
	if (!dob) return "";

	const today = new Date();
	let age = today.getFullYear() - dob.getFullYear();
	const monthDiff = today.getMonth() - dob.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
		age -= 1;
	}
	return age < 0 ? "" : age;
};

const toValidAgeValue = (value) => {
	const parsed = Number.parseInt(value, 10);
	if (Number.isNaN(parsed) || parsed <= 0 || parsed > 120) return "";
	return parsed;
};

const resolveAge = (person = {}, dateCandidates = []) => {
	// Support legacy records that may have explicit age fields.
	const directAge =
		toValidAgeValue(person?.age) ||
		toValidAgeValue(person?.Age) ||
		toValidAgeValue(person?.personAge);
	if (directAge) return directAge;

	for (const candidate of dateCandidates) {
		const ageFromDob = calculateAge(candidate);
		if (ageFromDob !== "") return ageFromDob;
	}

	return "";
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

const mapBuyerToFinanceStatement = async (buyer) => {
	const finance = buyer?.finance || {};
	const vehicle = buyer?.vehicle || {};
	const guarantor = buyer?.guarantor || {};
	const resolvedDistrict = buyer?.district || "";
	const resolvedMandal = buyer?.mandal || "";
	const resolvedAddressParts = [buyer?.fullAddress || buyer?.street || "", resolvedMandal, resolvedDistrict]
		.map((part) => String(part || "").trim())
		.filter(Boolean);
	const resolvedAddress = [...new Set(resolvedAddressParts)].join(", ");
	const resolvedGuarantorDistrict = guarantor?.district || "";
	const resolvedGuarantorMandal = guarantor?.mandal || "";
	const resolvedGuarantorAddressParts = [
		guarantor?.address || "",
		resolvedGuarantorMandal,
		resolvedGuarantorDistrict,
	]
		.map((part) => String(part || "").trim())
		.filter(Boolean);
	const resolvedGuarantorAddress = [...new Set(resolvedGuarantorAddressParts)].join(", ");
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

	// Generate signed URLs for images
	const partyPhotoUrl = await getSignedImageUrl({ key: buyer?.profile });
	const guarantorPhotoUrl = await getSignedImageUrl({ key: guarantor?.guarantorPhoto });

	return {
		id: String(buyer?._id),
		seller: buyer?.name || "",
		buyerName: buyer?.name || "",
		sowoco: buyer?.sowoco || "",
		occupation: buyer?.occupation || "",
		vehicle: vehicle?.vehicleNumber || "",
		phoneNo: buyer?.phoneNo || "",
		alternatePhoneNo: buyer?.alternatePhoneNo || buyer?.alternatePhone || "",
		financeAmount,
		emiDate: formatDisplayDate(finance?.emiStartDate || finance?.emiDate),
		emi: emiAmount,
		age: resolveAge(buyer, [buyer?.dateOfBirth, buyer?.dob, buyer?.birthDate, buyer?.date_of_birth]),
		address: resolvedAddress,
		district: resolvedDistrict,
		mandal: resolvedMandal,
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
		guarantorSowoco: guarantor?.sowoco || "",
		guarantorOccupation: guarantor?.occupation || "",
		guarantorAge: resolveAge(guarantor, [guarantor?.dateOfBirth, guarantor?.dob, guarantor?.birthDate, guarantor?.guarantorDob]),
		guarantorPhoneNo: guarantor?.phoneNo || "",
		guarantorAlternatePhoneNo: guarantor?.alternatePhoneNo || "",
		guarantorAddress: resolvedGuarantorAddress,
		guarantorDistrict: resolvedGuarantorDistrict,
		guarantorMandal: resolvedGuarantorMandal,
		partyPhoto: partyPhotoUrl,
		guarantorPhoto: guarantorPhotoUrl,
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
			.select("name sowoco occupation agreementNo phoneNo alternatePhoneNo district mandal fullAddress dateOfBirth vehicle finance guarantor profile")
			.sort({ _id: -1 })
			.skip(skip)
			.limit(parsedLimit)
			.lean();

		const data = await Promise.all(buyers.map(mapBuyerToFinanceStatement));

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
			.select("name sowoco occupation agreementNo phoneNo alternatePhoneNo district mandal fullAddress dateOfBirth vehicle finance guarantor profile")
			.lean();

		if (!buyer) {
			return res.status(404).json({
				success: false,
				message: "Finance record not found",
			});
		}

		const statement = await mapBuyerToFinanceStatement(buyer);

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

		const trimmedBookNo = normalizeText(bookNo);
		const trimmedPageNo = normalizeText(pageNo);

		if (trimmedBookNo && trimmedPageNo) {
			const duplicateEntryBuyer = await Buyer.findOne({
				$or: [
					{ "finance.emiDates": { $elemMatch: { bookNo: trimmedBookNo, pageNo: trimmedPageNo } } },
					{ "finance.paymentEntries": { $elemMatch: { bookNo: trimmedBookNo, pageNo: trimmedPageNo } } },
				],
			})
				.select("name agreementNo")
				.lean();

			if (duplicateEntryBuyer) {
				return res.status(409).json({
					success: false,
					message: `Book No ${trimmedBookNo} and Page No ${trimmedPageNo} already exist with Agreement No ${duplicateEntryBuyer.agreementNo} (${duplicateEntryBuyer.name || "Unknown"})`,
					data: {
						bookNo: trimmedBookNo,
						pageNo: trimmedPageNo,
						agreementNo: duplicateEntryBuyer.agreementNo || "",
						name: duplicateEntryBuyer.name || "",
					},
				});
			}
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

		const currentEmiProgress = calculateEmiProgress(buyer.finance.emiDates || []);
		const totalPendingBeforeEntry = currentEmiProgress.reduce(
			(sum, item) => sum + Number(item?.pendingAmount || 0),
			0
		);

		if (totalPendingBeforeEntry <= 0) {
			return res.status(400).json({
				success: false,
				message: "Total paid completed. No EMI will be added further.",
			});
		}

		if (paidAmount > totalPendingBeforeEntry) {
			return res.status(400).json({
				success: false,
				message: `Entered amount exceeds pending amount (₹${totalPendingBeforeEntry}).`,
				data: {
					pendingAmount: totalPendingBeforeEntry,
				},
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
			targetEmi.bookNo = trimmedBookNo;
			targetEmi.pageNo = trimmedPageNo;

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
			bookNo: trimmedBookNo,
			pageNo: trimmedPageNo,
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
				bookNo: trimmedBookNo,
				pageNo: trimmedPageNo,
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

export const getCollectionAgents = async (req, res) => {
	try {
		const collectionAgents = await SubAdmin.find({
			roleName: "Collection Agent",
			status: "active",
		})
			.select("name")
			.sort({ name: 1 })
			.lean();

		const data = collectionAgents
			.map((agent) => String(agent?.name || "").trim())
			.filter(Boolean);

		return res.status(200).json({
			success: true,
			message: "Collection agents fetched successfully",
			data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch collection agents",
			error: error.message,
		});
	}
};

// Save a quick collection entry (aggNo + amount + agent)
export const saveCollectionEntry = async (req, res) => {
	try {
		const { agreementNo, amount, agentName } = req.body || {};

		const trimmedAgreementNo = normalizeText(agreementNo);
		if (!trimmedAgreementNo) {
			return res.status(400).json({ success: false, message: "agreementNo is required" });
		}

		const parsedAmount = Number(amount);
		if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
			return res.status(400).json({ success: false, message: "amount must be a valid number greater than 0" });
		}

		const trimmedAgent = normalizeText(agentName);
		if (!trimmedAgent) {
			return res.status(400).json({ success: false, message: "agentName is required" });
		}

		const existingEntry = await CollectionEntry.findOne({
			agreementNo: { $regex: `^${trimmedAgreementNo}$`, $options: "i" },
		})
			.select("agreementNo agentName")
			.lean();

		if (existingEntry) {
			const existingAgent = normalizeText(existingEntry.agentName);
			const isSameAgent = existingAgent.toLowerCase() === trimmedAgent.toLowerCase();

			return res.status(409).json({
				success: false,
				message: isSameAgent
					? `Agreement No ${trimmedAgreementNo} is already added under Agent ${existingAgent}`
					: `Agreement No ${trimmedAgreementNo} is already added under Agent ${existingAgent}. You cannot add it under Agent ${trimmedAgent}`,
				data: {
					agreementNo: trimmedAgreementNo,
					existingAgentName: existingAgent,
					requestedAgentName: trimmedAgent,
				},
			});
		}

		const entry = await CollectionEntry.create({
			agreementNo: trimmedAgreementNo,
			amount: parsedAmount,
			paidAmount: 0,
			status: "pending",
			agentName: trimmedAgent,
			createdBy: req.subAdminId || null,
		});

		const buyer = await Buyer.findOne({ agreementNo: trimmedAgreementNo })
			.select("name phoneNo vehicle finance")
			.lean();

		return res.status(201).json({
			success: true,
			message: "Collection entry saved successfully",
			data: {
				id: String(entry._id),
				agreementNo: entry.agreementNo,
				amount: entry.amount,
				paidAmount: Number(entry.paidAmount || 0),
				status: entry.status || "pending",
				agentName: entry.agentName,
				date: entry.date,
				createdAt: entry.createdAt,
				name: buyer?.name || "",
				vehicle: buyer?.vehicle?.vehicleNumber || "",
				phoneNo: buyer?.phoneNo || "",
				emi: Number(buyer?.finance?.emiAmount || 0),
				emiDate: formatDisplayDate(buyer?.finance?.emiStartDate || buyer?.finance?.emiDate),
				buyerId: buyer ? String(buyer._id) : "",
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to save collection entry",
			error: error.message,
		});
	}
};

// Delete a collection entry
export const deleteCollectionEntry = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedEntry = await CollectionEntry.findByIdAndDelete(id);
		if (!deletedEntry) {
			return res.status(404).json({ success: false, message: "Collection entry not found" });
		}

		return res.status(200).json({
			success: true,
			message: "Collection entry deleted successfully",
			data: { id: String(deletedEntry._id) },
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to delete collection entry",
			error: error.message,
		});
	}
};

// Delete all collection entries for all agents
export const clearCollectionEntries = async (req, res) => {
	try {
		const result = await CollectionEntry.deleteMany({});

		return res.status(200).json({
			success: true,
			message: "All collection entries deleted successfully",
			data: {
				deletedCount: Number(result?.deletedCount || 0),
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to clear collection entries",
			error: error.message,
		});
	}
};

// Get all collection entries, optionally filtered by agentName and date
export const getCollectionEntries = async (req, res) => {
	try {
		const { agentName = "", date = "" } = req.query;

		const query = {};
		if (agentName && agentName.trim()) {
			query.agentName = { $regex: `^${agentName.trim()}$`, $options: "i" };
		}

		if (date && date.trim()) {
			const selectedDate = new Date(date);
			if (isNaN(selectedDate.getTime())) {
				return res.status(400).json({ success: false, message: "Invalid date" });
			}

			const startOfDay = new Date(selectedDate);
			startOfDay.setHours(0, 0, 0, 0);
			const endOfDay = new Date(selectedDate);
			endOfDay.setHours(23, 59, 59, 999);
			query.date = { $gte: startOfDay, $lte: endOfDay };
		}

		const entries = await CollectionEntry.find(query)
			.sort({ createdAt: -1 })
			.lean();

		const agreementNos = [...new Set(entries.map((e) => e.agreementNo).filter(Boolean))];
		let buyerMap = {};
		if (agreementNos.length > 0) {
			const buyers = await Buyer.find({ agreementNo: { $in: agreementNos } })
				.select("name agreementNo phoneNo vehicle finance")
				.lean();
			for (const buyer of buyers) {
				buyerMap[buyer.agreementNo] = buyer;
			}
		}

		const data = entries.map((entry) => {
			const buyer = buyerMap[entry.agreementNo] || null;
			return {
				id: String(entry._id),
				agreementNo: entry.agreementNo,
				amount: entry.amount,
				paidAmount: Number(entry.paidAmount || 0),
				status: entry.status || "pending",
				agentName: entry.agentName,
				date: entry.date,
				createdAt: entry.createdAt,
				name: buyer?.name || "",
				vehicle: buyer?.vehicle?.vehicleNumber || "",
				phoneNo: buyer?.phoneNo || "",
				emi: Number(buyer?.finance?.emiAmount || 0),
				emiDate: formatDisplayDate(buyer?.finance?.emiStartDate || buyer?.finance?.emiDate),
				buyerId: buyer ? String(buyer._id) : "",
			};
		});

		return res.status(200).json({
			success: true,
			message: "Collection entries fetched successfully",
			data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch collection entries",
			error: error.message,
		});
	}
};

// Update collection entry editable fields
export const updateCollectionEntry = async (req, res) => {
	try {
		const { id } = req.params;
		const { date, amount, paidAmount, status } = req.body || {};

		const updateDoc = {};

		if (date !== undefined) {
			const parsedDate = new Date(date);
			if (isNaN(parsedDate.getTime())) {
				return res.status(400).json({ success: false, message: "Invalid date" });
			}
			updateDoc.date = parsedDate;
		}

		if (amount !== undefined) {
			const parsedAmount = Number(amount);
			if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
				return res.status(400).json({ success: false, message: "amount must be a valid number" });
			}
			updateDoc.amount = parsedAmount;
		}

		if (paidAmount !== undefined) {
			const parsedPaidAmount = Number(paidAmount);
			if (Number.isNaN(parsedPaidAmount) || parsedPaidAmount < 0) {
				return res.status(400).json({ success: false, message: "paidAmount must be a valid number" });
			}
			updateDoc.paidAmount = parsedPaidAmount;
		}

		if (status !== undefined) {
			const normalizedStatus = normalizeText(status).toLowerCase();
			const allowedStatuses = ["none", "paid", "pending", "mark"];
			if (!allowedStatuses.includes(normalizedStatus)) {
				return res.status(400).json({ success: false, message: "Invalid status" });
			}
			updateDoc.status = normalizedStatus;
		}

		if (Object.keys(updateDoc).length === 0) {
			return res.status(400).json({ success: false, message: "No fields provided to update" });
		}

		const entry = await CollectionEntry.findByIdAndUpdate(
			id,
			updateDoc,
			{ new: true }
		);

		if (!entry) {
			return res.status(404).json({ success: false, message: "Collection entry not found" });
		}

		return res.status(200).json({
			success: true,
			message: "Collection entry updated successfully",
			data: {
				id: String(entry._id),
				date: entry.date,
				amount: entry.amount,
				paidAmount: Number(entry.paidAmount || 0),
				status: entry.status || "pending",
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update collection entry",
			error: error.message,
		});
	}
};
