import OwnershipTransfer from "../../models/ownershipTransferModel.js";

const VALID_STATUSES = ["ekyc", "token", "challan", "finance approval", "rto approval", "completed"];

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Create a new ownership transfer entry
export const createOwnershipTransfer = async (req, res) => {
    try {
        const { name, phoneNo, vehicleNumber, chassisNumber, paidAmount, status, notes } = req.body;
        const subAdminId = req.subAdminId;

        if (!name || !phoneNo || !vehicleNumber || !chassisNumber || !paidAmount) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        if (!subAdminId) {
            return res.status(401).json({ message: "Unauthorized: SubAdmin ID not found" });
        }

        const newTransfer = new OwnershipTransfer({
            name,
            phoneNo,
            vehicleNumber,
            chassisNumber,
            paidAmount,
            status: status || "pending",
            notes,
            subAdminId
        });

        await newTransfer.save();
        res.status(201).json({
            message: "Ownership transfer entry created successfully",
            data: newTransfer
        });
    } catch (error) {
        console.error("Error creating ownership transfer:", error);
        res.status(500).json({ message: "Failed to create ownership transfer entry", error: error.message });
    }
};

// Get all ownership transfer entries for a specific sub-admin
export const getAllOwnershipTransfers = async (req, res) => {
    try {
        const subAdminId = req.subAdminId;
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
        const status = req.query.status?.trim();
        const search = req.query.search?.trim();

        if (!subAdminId) {
            return res.status(401).json({ message: "Unauthorized: SubAdmin ID not found" });
        }

        const query = { subAdminId };

        if (status && status !== "all") {
            if (!VALID_STATUSES.includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            query.status = status;
        }

        if (search) {
            const escapedSearch = escapeRegex(search);
            query.$or = [
                { name: { $regex: escapedSearch, $options: "i" } },
                { phoneNo: { $regex: escapedSearch, $options: "i" } },
                { vehicleNumber: { $regex: escapedSearch, $options: "i" } },
                { chassisNumber: { $regex: escapedSearch, $options: "i" } },
                { notes: { $regex: escapedSearch, $options: "i" } }
            ];
        }

        const [transfers, totalCount, statusBreakdown] = await Promise.all([
            OwnershipTransfer.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            OwnershipTransfer.countDocuments(query),
            OwnershipTransfer.aggregate([
                { $match: { subAdminId } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ])
        ]);

        const statusCounts = VALID_STATUSES.reduce((accumulator, currentStatus) => {
            accumulator[currentStatus] = 0;
            return accumulator;
        }, { all: 0 });

        statusBreakdown.forEach(item => {
            if (item._id) {
                statusCounts[item._id] = item.count;
            }
        });

        statusCounts.all = await OwnershipTransfer.countDocuments({ subAdminId });

        res.status(200).json({
            message: "Ownership transfers retrieved successfully",
            data: transfers,
            count: totalCount,
            page,
            limit,
            totalPages: Math.max(Math.ceil(totalCount / limit), 1),
            statusCounts
        });
    } catch (error) {
        console.error("Error fetching ownership transfers:", error);
        res.status(500).json({ message: "Failed to fetch ownership transfers", error: error.message });
    }
};

// Get a single ownership transfer entry by ID
export const getOwnershipTransferById = async (req, res) => {
    try {
        const { id } = req.params;
        const subAdminId = req.subAdminId;

        if (!subAdminId) {
            return res.status(401).json({ message: "Unauthorized: SubAdmin ID not found" });
        }

        const transfer = await OwnershipTransfer.findOne({
            _id: id,
            subAdminId
        });

        if (!transfer) {
            return res.status(404).json({ message: "Ownership transfer entry not found" });
        }

        res.status(200).json({
            message: "Ownership transfer retrieved successfully",
            data: transfer
        });
    } catch (error) {
        console.error("Error fetching ownership transfer:", error);
        res.status(500).json({ message: "Failed to fetch ownership transfer", error: error.message });
    }
};

// Update an ownership transfer entry
export const updateOwnershipTransfer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phoneNo, vehicleNumber, chassisNumber, paidAmount, status, notes } = req.body;
        const subAdminId = req.subAdminId;

        if (!subAdminId) {
            return res.status(401).json({ message: "Unauthorized: SubAdmin ID not found" });
        }

        const transfer = await OwnershipTransfer.findOneAndUpdate(
            { _id: id, subAdminId },
            {
                name,
                phoneNo,
                vehicleNumber,
                chassisNumber,
                paidAmount,
                status,
                notes,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!transfer) {
            return res.status(404).json({ message: "Ownership transfer entry not found" });
        }

        res.status(200).json({
            message: "Ownership transfer updated successfully",
            data: transfer
        });
    } catch (error) {
        console.error("Error updating ownership transfer:", error);
        res.status(500).json({ message: "Failed to update ownership transfer", error: error.message });
    }
};

// Delete an ownership transfer entry
export const deleteOwnershipTransfer = async (req, res) => {
    try {
        const { id } = req.params;
        const subAdminId = req.subAdminId;

        if (!subAdminId) {
            return res.status(401).json({ message: "Unauthorized: SubAdmin ID not found" });
        }

        const transfer = await OwnershipTransfer.findOneAndDelete({
            _id: id,
            subAdminId
        });

        if (!transfer) {
            return res.status(404).json({ message: "Ownership transfer entry not found" });
        }

        res.status(200).json({
            message: "Ownership transfer deleted successfully",
            data: transfer
        });
    } catch (error) {
        console.error("Error deleting ownership transfer:", error);
        res.status(500).json({ message: "Failed to delete ownership transfer", error: error.message });
    }
};

// Get ownership transfers by status
export const getOwnershipTransfersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const subAdminId = req.subAdminId;
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

        if (!subAdminId) {
            return res.status(401).json({ message: "Unauthorized: SubAdmin ID not found" });
        }

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const query = {
            subAdminId,
            status
        };

        const [transfers, totalCount] = await Promise.all([
            OwnershipTransfer.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            OwnershipTransfer.countDocuments(query)
        ]);

        res.status(200).json({
            message: `Ownership transfers with status '${status}' retrieved successfully`,
            data: transfers,
            count: totalCount,
            page,
            limit,
            totalPages: Math.max(Math.ceil(totalCount / limit), 1)
        });
    } catch (error) {
        console.error("Error fetching ownership transfers by status:", error);
        res.status(500).json({ message: "Failed to fetch ownership transfers", error: error.message });
    }
};
