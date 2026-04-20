import Request from "../models/requestModel.js";

const normalizeText = (value) => String(value || "").trim();

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const buildApplicationNo = (item) => {
  if (item?.applicationNo) return item.applicationNo;
  const createdAt = item?.createdAt ? new Date(item.createdAt) : new Date();
  const year = String(createdAt.getFullYear()).slice(-2);
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const day = String(createdAt.getDate()).padStart(2, "0");
  const suffix = String(item?._id || "").slice(-6).toUpperCase();
  return `APP-${year}${month}${day}-${suffix}`;
};

const toRequestDTO = (item) => ({
  id: String(item?._id),
  applicationNo: buildApplicationNo(item),
  type: item?.requestType || "other",
  status: item?.status || "pending",
  createdAt: item?.createdAt,
  name: item?.name || "",
  email: item?.email || "",
  phoneNumber: item?.phoneNumber || "",
  vehicleNumber: item?.vehicleNumber || "",
  chassisNumber: item?.chassisNumber || "",
  vehicleName: item?.vehicleName || "",
  vehicleManufactureYear: item?.vehicleManufactureYear || null,
  requestedAmount: Number(item?.requestedAmount || 0),
  purpose: item?.purpose || item?.subject || "",
  subject: item?.subject || "",
  message: item?.message || "",
  comments: item?.comments || "",
  adminNotes: item?.adminNotes || "",
  extraData: item?.extraData || {},
});

const buildSearchQuery = (search) => {
  const trimmedSearch = normalizeText(search);
  if (!trimmedSearch) return null;

  return {
    $or: [
      { name: { $regex: trimmedSearch, $options: "i" } },
      { email: { $regex: trimmedSearch, $options: "i" } },
      { phoneNumber: { $regex: trimmedSearch, $options: "i" } },
      { vehicleNumber: { $regex: trimmedSearch, $options: "i" } },
      { chassisNumber: { $regex: trimmedSearch, $options: "i" } },
      { purpose: { $regex: trimmedSearch, $options: "i" } },
      { subject: { $regex: trimmedSearch, $options: "i" } },
      { message: { $regex: trimmedSearch, $options: "i" } },
      { comments: { $regex: trimmedSearch, $options: "i" } },
    ],
  };
};

export const createFinanceRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      vehicleNumber,
      chassisNumber,
      vehicleName = "",
      vehicleManufactureYear = null,
      requestedAmount,
      purpose = "refinance",
      comments = "",
    } = req.body || {};

    const payload = {
      name: normalizeText(name),
      email: normalizeText(email).toLowerCase(),
      phoneNumber: normalizeText(phoneNumber),
      vehicleNumber: normalizeText(vehicleNumber),
      chassisNumber: normalizeText(chassisNumber),
      vehicleName: normalizeText(vehicleName),
      vehicleManufactureYear: vehicleManufactureYear ? Number(vehicleManufactureYear) : null,
      requestedAmount: Number(requestedAmount),
      purpose: normalizeText(purpose),
      comments: normalizeText(comments),
    };

    if (!payload.name || !payload.email || !payload.phoneNumber || !payload.vehicleNumber || !payload.chassisNumber) {
      return res.status(400).json({
        success: false,
        message: "name, email, phoneNumber, vehicleNumber and chassisNumber are required",
      });
    }

    if (!Number.isFinite(payload.requestedAmount) || payload.requestedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "requestedAmount must be greater than 0",
      });
    }

    const duplicateQuery = {
      requestType: "finance",
      status: { $nin: ["resolved", "rejected"] },
      $or: [{ email: payload.email }, { phoneNumber: payload.phoneNumber }],
    };

    if (req.userId) {
      duplicateQuery.$or.push({ createdByUser: req.userId });
    }

    const existingRequest = await Request.findOne(duplicateQuery).select("_id status").lean();

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "An active finance request already exists for this user",
      });
    }

    const created = await Request.create({
      requestType: "finance",
      status: "pending",
      createdByUser: req.userId || null,
      ...payload,
    });

    return res.status(201).json({
      success: true,
      message: "Finance request created successfully",
      data: toRequestDTO(created),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create finance request",
      error: error.message,
    });
  }
};

export const createContactRequest = async (req, res) => {
  try {
    const {
      requestType = "contact",
      name,
      email = "",
      phoneNumber = "",
      purpose = "",
      subject = "",
      message = "",
      comments = "",
      status,
      extraData = {},
    } = req.body || {};

    const allowedRequestTypes = ["contact", "support", "application", "ticket", "other"];
    const normalizedType = normalizeText(requestType).toLowerCase();

    if (!allowedRequestTypes.includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid requestType",
      });
    }

    const normalizedName = normalizeText(name);
    const normalizedEmail = normalizeText(email).toLowerCase();
    const normalizedPhone = normalizeText(phoneNumber);

    if (!normalizedName) {
      return res.status(400).json({ success: false, message: "name is required" });
    }

    if (!normalizedEmail && !normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: "email or phoneNumber is required",
      });
    }

    const finalMessage = normalizeText(message || comments);
    if (!finalMessage && !normalizeText(subject) && !normalizeText(purpose)) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one of message, subject, or purpose",
      });
    }

    const created = await Request.create({
      requestType: normalizedType,
      status: normalizeText(status).toLowerCase() || "open",
      createdByUser: req.userId || null,
      name: normalizedName,
      email: normalizedEmail,
      phoneNumber: normalizedPhone,
      purpose: normalizeText(purpose),
      subject: normalizeText(subject),
      message: finalMessage,
      comments: normalizeText(comments),
      extraData: typeof extraData === "object" && extraData !== null ? extraData : {},
    });

    return res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      data: toRequestDTO(created),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit request",
      error: error.message,
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const { type = "all", status = "all", search = "", page = 1, limit = 20 } = req.query;

    const query = {
      createdByUser: req.userId,
    };

    const normalizedType = normalizeText(type).toLowerCase();
    if (normalizedType && normalizedType !== "all") {
      query.requestType = normalizedType;
    }

    const normalizedStatus = normalizeText(status).toLowerCase();
    if (normalizedStatus && normalizedStatus !== "all") {
      query.status = normalizedStatus;
    }

    const searchQuery = buildSearchQuery(search);
    if (searchQuery) {
      query.$and = query.$and || [];
      query.$and.push(searchQuery);
    }

    const parsedPage = toPositiveInt(page, 1);
    const parsedLimit = Math.min(toPositiveInt(limit, 20), 100);

    const totalRecords = await Request.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(totalRecords / parsedLimit));
    const safePage = Math.min(parsedPage, totalPages);
    const skip = (safePage - 1) * parsedLimit;

    const rows = await Request.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      data: rows.map(toRequestDTO),
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
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};

export const getAllRequestsForManagement = async (req, res) => {
  try {
    const { type = "all", status = "all", search = "", page = 1, limit = 20 } = req.query;

    const query = {};

    const normalizedType = normalizeText(type).toLowerCase();
    if (normalizedType && normalizedType !== "all") {
      query.requestType = normalizedType;
    }

    const normalizedStatus = normalizeText(status).toLowerCase();
    if (normalizedStatus && normalizedStatus !== "all") {
      query.status = normalizedStatus;
    }

    const searchQuery = buildSearchQuery(search);
    if (searchQuery) {
      query.$and = query.$and || [];
      query.$and.push(searchQuery);
    }

    // Separate query for type counts - without type/status/search filters to show totals per type
    const typeCountQuery = {};

    const parsedPage = toPositiveInt(page, 1);
    const parsedLimit = Math.min(toPositiveInt(limit, 20), 100);

    const [
      totalRecords,
      rows,
      pendingCount,
      approvedCount,
      rejectedCount,
      typeCountRows,
    ] = await Promise.all([
      Request.countDocuments(query),
      Request.find(query)
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit)
        .lean(),
      Request.countDocuments({ ...query, status: "pending" }),
      Request.countDocuments({ ...query, status: "approved" }),
      Request.countDocuments({ ...query, status: "rejected" }),
      Request.aggregate([
        { $match: typeCountQuery },
        { $group: { _id: "$requestType", count: { $sum: 1 } } },
      ]),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalRecords / parsedLimit));
    const safePage = Math.min(parsedPage, totalPages);

    let pagedRows = rows;
    if (safePage !== parsedPage) {
      pagedRows = await Request.find(query)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * parsedLimit)
        .limit(parsedLimit)
        .lean();
    }

    // Get total count of all requests for "all" tab
    const allRequestsTotal = await Request.countDocuments({});

    const typeCounts = {
      all: allRequestsTotal,
      finance: 0,
      contact: 0,
      support: 0,
      application: 0,
      ticket: 0,
      other: 0,
    };

    typeCountRows.forEach((row) => {
      const key = normalizeText(row?._id).toLowerCase();
      if (Object.prototype.hasOwnProperty.call(typeCounts, key)) {
        typeCounts[key] = Number(row?.count || 0);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      data: pagedRows.map(toRequestDTO),
      summary: {
        total: totalRecords,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        typeCounts,
      },
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
      message: "Failed to fetch management requests",
      error: error.message,
    });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes = "" } = req.body || {};

    const allowedStatuses = ["pending", "open", "approved", "rejected", "resolved"];
    const normalizedStatus = normalizeText(status).toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updated = await Request.findByIdAndUpdate(
      id,
      {
        $set: {
          status: normalizedStatus,
          adminNotes: normalizeText(adminNotes),
        },
      },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      data: toRequestDTO(updated),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update request status",
      error: error.message,
    });
  }
};

export const deleteRequestForManagement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Request.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully",
      data: { id: String(deleted._id) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete request",
      error: error.message,
    });
  }
};
