import jwt from "jsonwebtoken";
import SubAdmin from "../models/subAdminModel.js";

// Temporary store for pending registrations
const pendingRegistrations = new Map();

// Cleanup expired registrations every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of pendingRegistrations.entries()) {
    if (value.otpExpiresAt < now || (now - value.createdAt) > 15 * 60 * 1000) {
      pendingRegistrations.delete(key);
    }
  }
}, 10 * 60 * 1000);

// 🔐 Get token from request body, Authorization header, or cookie
const getTokenFromRequest = (req) => {
  const tokenFromBody = req.body?.token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const tokenFromCookie = req.cookies?.accessToken;
  return tokenFromBody || tokenFromHeader || tokenFromCookie;
};

// 🔍 Decode JWT token
const decodeToken = (token, secret) => {
  if (!token) {
    throw new Error("No token provided");
  }
  if (!secret) {
    throw new Error("JWT secret is not defined in environment variables");
  }
  return jwt.verify(token, secret);
};

// Middleware to verify SubAdmin access token
const verifySubAdminToken = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    const decoded = decodeToken(token, process.env.ACCESS_TOKEN_SECRET);

    const subAdmin = await SubAdmin.findById(decoded._id || decoded.id);
    if (!subAdmin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: SubAdmin not found",
      });
    }

    // Add subAdmin to req object
    req.subAdmin = subAdmin;
    req.subAdminId = subAdmin._id;
    next();
  } catch (error) {
    console.error("Access token error:", error.message);
    const message =
      error.name === "TokenExpiredError"
        ? "Access token has expired"
        : error.name === "JsonWebTokenError"
        ? "Invalid access token"
        : error.message;
    return res.status(401).json({ success: false, message });
  }
};

// Middleware to verify sub-admin OTP token for pending registrations
const verifySubAdminOtpToken = async (req, res, next) => {
  try {
    const tokenFromBody = req.body?.token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const tokenFromCookie = req.cookies?.accessToken;
    const token = tokenFromBody || tokenFromHeader || tokenFromCookie;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.OTP_TOKEN_SECRET);
    
    // Attach registrationId to request
    req.registrationId = decoded.registrationId;
    req.email = decoded.email;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "OTP token has expired. Please register again."
        : error.name === "JsonWebTokenError"
        ? "Invalid OTP token"
        : error.message;
    return res.status(401).json({ 
      success: false, 
      message 
    });
  }
};

const MODULE_ALIASES = {
  pendingpayment: "pendingPayments",
  pendingpayments: "pendingPayments",
  pendingdownpayment: "pendingPayments",
  requestcenter: "requestCenter",
  vehiclestock: "vehicleStock",
  ownershiptransfer: "ownershipTransfer",
  addentry: "addEntry",
};

const normalizeModuleName = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const key = raw.replace(/[^a-zA-Z]/g, "").toLowerCase();
  return MODULE_ALIASES[key] || raw;
};

const hasEditAccess = (permission) => {
  const value = permission?.actions?.edit ?? permission?.edit ?? permission?.actions?.canEdit;
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return Boolean(value);
};

// Middleware to check if SubAdmin has edit permission for a module
const checkModuleEditPermission = (moduleName) => {
  return async (req, res, next) => {
    try {
      const subAdmin = req.subAdmin;
      
      if (!subAdmin) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: SubAdmin not found in request",
        });
      }

      // Check if subAdmin has permissions array
      if (!Array.isArray(subAdmin.permissions) || subAdmin.permissions.length === 0) {
        return res.status(403).json({
          success: false,
          message: `Access denied: You don't have permission to edit ${moduleName}`,
        });
      }

      // Find the permission for the specific module
      const normalizedTarget = normalizeModuleName(moduleName);
      const modulePermission = subAdmin.permissions.find(
        (perm) => normalizeModuleName(perm?.module || perm?.name || perm?.key) === normalizedTarget
      );

      // Check if module permission exists and edit is allowed
      if (!modulePermission || !hasEditAccess(modulePermission)) {
        console.warn(`[Permission] SubAdmin ${subAdmin._id} denied edit access to ${moduleName}`);
        return res.status(403).json({
          success: false,
          message: `Access denied: You don't have edit permission for ${moduleName}`,
        });
      }

      // Permission granted, continue
      console.log(`[Permission] SubAdmin ${subAdmin._id} granted edit access to ${moduleName}`);
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during permission check",
        error: error.message,
      });
    }
  };
};

export { verifySubAdminToken, verifySubAdminOtpToken, pendingRegistrations, checkModuleEditPermission };
