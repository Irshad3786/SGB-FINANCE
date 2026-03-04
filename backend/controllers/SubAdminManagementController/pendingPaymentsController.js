import Buyer from "../../models/buyerModel.js";

const formatIsoDate = (value) => {
	if (!value) return "";
	const dateObj = new Date(value);
	if (Number.isNaN(dateObj.getTime())) return "";
	return dateObj.toISOString().split("T")[0];
};

const normalizeSearch = (value) => String(value || "").trim().toLowerCase();

const resolvePaymentStatus = (dpPayment = {}) => {
	const status = String(dpPayment?.status || "").toLowerCase();
	if (status === "paid") return "paid";

	const dueDate = dpPayment?.dueDate ? new Date(dpPayment.dueDate) : null;
	if (dueDate && !Number.isNaN(dueDate.getTime())) {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const due = new Date(dueDate);
		due.setHours(0, 0, 0, 0);
		if (due < now) return "overdue";
	}

	return "pending";
};

export const getPendingPayments = async (req, res) => {
	try {
		const { search = "", commitmentDate = "", page = 1, limit = 10 } = req.query;

		const buyers = await Buyer.find({
			"dpPayment.amount": { $gt: 0 },
			"dpPayment.status": { $ne: "paid" },
		})
			.select("name phoneNo fullAddress dpPayment")
			.lean();

		const normalizedQuery = normalizeSearch(search);
		const parsedPage = Math.max(1, Number.parseInt(page, 10) || 1);
		const parsedLimit = Math.max(1, Number.parseInt(limit, 10) || 10);

		const filteredRecords = buyers
			.map((buyer) => ({
				id: String(buyer?._id),
				buyerId: String(buyer?._id),
				name: buyer?.name || "",
				phoneNumber: buyer?.phoneNo || "",
				address: buyer?.fullAddress || "",
				downpaymentAmount: Number(buyer?.dpPayment?.amount || 0),
				paymentDueDate: formatIsoDate(buyer?.dpPayment?.dueDate),
				commitmentDate: formatIsoDate(buyer?.dpPayment?.commitmentDate),
				status: resolvePaymentStatus(buyer?.dpPayment),
			}))
			.filter((record) => {
				if (normalizedQuery) {
					const haystack = `${record.name} ${record.phoneNumber} ${record.address}`.toLowerCase();
					if (!haystack.includes(normalizedQuery)) return false;
				}

				if (commitmentDate && record.commitmentDate !== commitmentDate) {
					return false;
				}

				return true;
			});

		const totalRecords = filteredRecords.length;
		const totalPages = Math.max(1, Math.ceil(totalRecords / parsedLimit));
		const safePage = Math.min(parsedPage, totalPages);
		const startIndex = (safePage - 1) * parsedLimit;
		const records = filteredRecords.slice(startIndex, startIndex + parsedLimit);

		return res.status(200).json({
			success: true,
			message: "Pending payments fetched successfully",
			data: records,
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
			message: "Failed to fetch pending payments",
			error: error.message,
		});
	}
};

export const updatePendingPaymentCommitmentDate = async (req, res) => {
	try {
		const { buyerId } = req.params;
		const { commitmentDate } = req.body;

		if (!commitmentDate) {
			return res.status(400).json({
				success: false,
				message: "Commitment date is required",
			});
		}

		const parsedCommitmentDate = new Date(commitmentDate);
		if (Number.isNaN(parsedCommitmentDate.getTime())) {
			return res.status(400).json({
				success: false,
				message: "Invalid commitment date",
			});
		}

		const buyer = await Buyer.findById(buyerId);
		if (!buyer) {
			return res.status(404).json({ success: false, message: "Buyer not found" });
		}

		if (!buyer.dpPayment || Number(buyer?.dpPayment?.amount || 0) <= 0) {
			return res.status(404).json({ success: false, message: "Pending payment not found" });
		}

		buyer.dpPayment.commitmentDate = parsedCommitmentDate;
		await buyer.save();

		return res.status(200).json({
			success: true,
			message: "Commitment date updated successfully",
			data: {
				id: String(buyer._id),
				commitmentDate: formatIsoDate(buyer.dpPayment.commitmentDate),
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update commitment date",
			error: error.message,
		});
	}
};

export const updatePendingPaymentStatus = async (req, res) => {
	try {
		const { buyerId } = req.params;
		const { status } = req.body;

		const normalizedStatus = String(status || "").trim().toLowerCase();
		if (!["pending", "paid", "overdue"].includes(normalizedStatus)) {
			return res.status(400).json({
				success: false,
				message: "Status must be pending, paid, or overdue",
			});
		}

		const buyer = await Buyer.findById(buyerId);
		if (!buyer) {
			return res.status(404).json({ success: false, message: "Buyer not found" });
		}

		if (!buyer.dpPayment || Number(buyer?.dpPayment?.amount || 0) <= 0) {
			return res.status(404).json({ success: false, message: "Pending payment not found" });
		}

		buyer.dpPayment.status = normalizedStatus;
		await buyer.save();

		return res.status(200).json({
			success: true,
			message: "Payment status updated successfully",
			data: {
				id: String(buyer._id),
				status: buyer.dpPayment.status,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update payment status",
			error: error.message,
		});
	}
};

export const updatePendingPaymentAmount = async (req, res) => {
	try {
		const { buyerId } = req.params;
		const { amount } = req.body;

		const parsedAmount = Number(amount);
		if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
			return res.status(400).json({
				success: false,
				message: "Amount must be a valid number greater than 0",
			});
		}

		const buyer = await Buyer.findById(buyerId);
		if (!buyer) {
			return res.status(404).json({ success: false, message: "Buyer not found" });
		}

		if (!buyer.dpPayment) {
			return res.status(404).json({ success: false, message: "Pending payment not found" });
		}

		buyer.dpPayment.amount = parsedAmount;
		if (!buyer.dpPayment.status || buyer.dpPayment.status === "paid") {
			buyer.dpPayment.status = "pending";
		}

		await buyer.save();

		return res.status(200).json({
			success: true,
			message: "Pending amount updated successfully",
			data: {
				id: String(buyer._id),
				amount: Number(buyer.dpPayment.amount || 0),
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update pending amount",
			error: error.message,
		});
	}
};
