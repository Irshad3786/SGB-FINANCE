import mongoose from "mongoose";
import SubAdmin from "../../models/subAdminModel.js";

const allowedRoleNames = ["Financer", "Collection Agent", "Data Entry"];
const allowedStatus = ["active", "inactive"];

const getCreatedSubAdmins = async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find({})
      .select("name email phone roleName status permissions createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Sub-admins fetched successfully",
      data: subAdmins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sub-admins",
      error: error.message,
    });
  }
};

const updateCreatedSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sub-admin id",
      });
    }

    const { name, phone, roleName, status, permissions } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!phone || !/^[0-9]{10,}$/.test(String(phone).replace(/\D/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Valid phone number is required",
      });
    }

    if (!allowedRoleNames.includes(roleName)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roleName",
      });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (permissions !== undefined && !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Permissions must be an array",
      });
    }

    const phoneInUse = await SubAdmin.findOne({
      _id: { $ne: id },
      phone: String(phone),
    }).lean();

    if (phoneInUse) {
      return res.status(400).json({
        success: false,
        message: "Phone number already in use by another sub-admin",
      });
    }

    const updatePayload = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      roleName,
      status,
    };

    if (permissions !== undefined) {
      updatePayload.permissions = permissions;
    }

    const updatedSubAdmin = await SubAdmin.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    })
      .select("name email phone roleName status permissions createdAt updatedAt")
      .lean();

    if (!updatedSubAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub-admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sub-admin updated successfully",
      data: updatedSubAdmin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update sub-admin",
      error: error.message,
    });
  }
};

export { getCreatedSubAdmins, updateCreatedSubAdmin };
