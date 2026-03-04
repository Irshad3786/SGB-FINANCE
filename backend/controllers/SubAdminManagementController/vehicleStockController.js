import Seller from "../../models/sellerModel.js";

const toValidDate = (value, fallbackDate) => {
	if (!value) return fallbackDate;
	const parsedDate = new Date(value);
	return Number.isNaN(parsedDate.getTime()) ? fallbackDate : parsedDate;
};

const formatIsoDate = (value) => {
	if (!value) return "";
	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) return "";
	return parsedDate.toISOString().split("T")[0];
};

const parseModelYear = (modelValue) => {
	if (!modelValue) return "";
	const yearMatch = String(modelValue).match(/\b(19|20)\d{2}\b/);
	return yearMatch ? Number(yearMatch[0]) : "";
};

const mapSparesForResponse = (usedSpares = []) => {
	return usedSpares.map((spare) => ({
		name: spare?.title || "",
		amount: Number(spare?.amount || 0),
		date: formatIsoDate(spare?.enteredDate),
		lastModified: formatIsoDate(spare?.modifiedDate),
	}));
};

const calculateWorkCost = (usedSpares = []) => {
	return usedSpares.reduce((sum, spare) => sum + Number(spare?.amount || 0), 0);
};

const mapSellerToVehicleStock = (seller) => {
	const usedSpares = seller?.vehicle?.usedSpares || [];

	return {
		id: String(seller?._id),
		sellerId: String(seller?._id),
		modelName: seller?.vehicle?.vehicleName || "N/A",
		regNo: seller?.vehicle?.vehicleNumber || "",
		chassisNo: seller?.vehicle?.chassisNo || "",
		modelYear: parseModelYear(seller?.vehicle?.model),
		bikePrice: Number(seller?.vehicle?.bikePrice || 0),
		workCost: calculateWorkCost(usedSpares),
		sellerName: seller?.fullName || "",
		sellerPhone: seller?.phoneNo || "",
		status: seller?.vehicle?.status || "available",
		workDetails: mapSparesForResponse(usedSpares),
	};
};

export const getVehicleStock = async (req, res) => {
	try {
		const { search = "", page = 1, limit = 9 } = req.query;
		const parsedPage = Math.max(1, Number.parseInt(page, 10) || 1);
		const parsedLimit = Math.max(1, Number.parseInt(limit, 10) || 9);
		const trimmedSearch = String(search || "").trim();

		const query = {
			"vehicle.status": { $ne: "sold" },
		};

		if (trimmedSearch) {
			query.$or = [
				{ fullName: { $regex: trimmedSearch, $options: "i" } },
				{ "vehicle.vehicleName": { $regex: trimmedSearch, $options: "i" } },
				{ "vehicle.vehicleNumber": { $regex: trimmedSearch, $options: "i" } },
				{ "vehicle.chassisNo": { $regex: trimmedSearch, $options: "i" } },
			];
		}

		const totalRecords = await Seller.countDocuments(query);
		const totalPages = Math.max(1, Math.ceil(totalRecords / parsedLimit));
		const safePage = Math.min(parsedPage, totalPages);
		const skip = (safePage - 1) * parsedLimit;

		const sellers = await Seller.find(query)
			.select("fullName phoneNo vehicle")
			.sort({ _id: -1 })
			.skip(skip)
			.limit(parsedLimit)
			.lean();

		const vehicleStock = sellers.map(mapSellerToVehicleStock);

		return res.status(200).json({
			success: true,
			message: "Vehicle stock fetched successfully",
			data: vehicleStock,
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
			message: "Failed to fetch vehicle stock",
			error: error.message,
		});
	}
};

export const addVehicleSpare = async (req, res) => {
	try {
		const { sellerId } = req.params;
		const { title, amount, date } = req.body;

		const spareTitle = String(title || "").trim();
		const spareAmount = Number(amount);

		if (!spareTitle) {
			return res.status(400).json({ success: false, message: "Spare title is required" });
		}

		if (Number.isNaN(spareAmount) || spareAmount < 0) {
			return res.status(400).json({ success: false, message: "Valid spare amount is required" });
		}

		const seller = await Seller.findById(sellerId);
		if (!seller) {
			return res.status(404).json({ success: false, message: "Vehicle not found" });
		}

		const now = new Date();
		const enteredDate = toValidDate(date, now);

		seller.vehicle = seller.vehicle || {};
		seller.vehicle.usedSpares = seller.vehicle.usedSpares || [];
		seller.vehicle.usedSpares.push({
			title: spareTitle,
			amount: spareAmount,
			enteredDate,
			modifiedDate: now,
		});

		await seller.save();

		const workDetails = mapSparesForResponse(seller.vehicle.usedSpares);

		return res.status(200).json({
			success: true,
			message: "Spare added successfully",
			data: {
				sellerId: String(seller._id),
				workDetails,
				workCost: calculateWorkCost(seller.vehicle.usedSpares),
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to add spare",
			error: error.message,
		});
	}
};

export const updateVehicleSpare = async (req, res) => {
	try {
		const { sellerId, spareIndex } = req.params;
		const { title, amount, date } = req.body;

		const parsedIndex = Number.parseInt(spareIndex, 10);
		if (Number.isNaN(parsedIndex) || parsedIndex < 0) {
			return res.status(400).json({ success: false, message: "Invalid spare index" });
		}

		const seller = await Seller.findById(sellerId);
		if (!seller) {
			return res.status(404).json({ success: false, message: "Vehicle not found" });
		}

		seller.vehicle = seller.vehicle || {};
		seller.vehicle.usedSpares = seller.vehicle.usedSpares || [];

		if (!seller.vehicle.usedSpares[parsedIndex]) {
			return res.status(404).json({ success: false, message: "Spare item not found" });
		}

		const currentSpare = seller.vehicle.usedSpares[parsedIndex];
		const nextTitle = String(title ?? currentSpare.title ?? "").trim();
		const nextAmount = amount === undefined ? Number(currentSpare.amount || 0) : Number(amount);

		if (!nextTitle) {
			return res.status(400).json({ success: false, message: "Spare title is required" });
		}

		if (Number.isNaN(nextAmount) || nextAmount < 0) {
			return res.status(400).json({ success: false, message: "Valid spare amount is required" });
		}

		const now = new Date();
		currentSpare.title = nextTitle;
		currentSpare.amount = nextAmount;
		currentSpare.enteredDate = toValidDate(date, currentSpare.enteredDate || now);
		currentSpare.modifiedDate = now;

		await seller.save();

		const workDetails = mapSparesForResponse(seller.vehicle.usedSpares);

		return res.status(200).json({
			success: true,
			message: "Spare updated successfully",
			data: {
				sellerId: String(seller._id),
				workDetails,
				workCost: calculateWorkCost(seller.vehicle.usedSpares),
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update spare",
			error: error.message,
		});
	}
};

export const markVehicleAsSold = async (req, res) => {
	try {
		const { sellerId } = req.params;

		const seller = await Seller.findById(sellerId);
		if (!seller) {
			return res.status(404).json({ success: false, message: "Vehicle not found" });
		}

		seller.vehicle = seller.vehicle || {};
		seller.vehicle.status = "sold";
		await seller.save();

		return res.status(200).json({
			success: true,
			message: "Vehicle marked as sold",
			data: {
				sellerId: String(seller._id),
				status: seller?.vehicle?.status || "sold",
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to mark vehicle as sold",
			error: error.message,
		});
	}
};
