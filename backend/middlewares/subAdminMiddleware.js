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

export { verifySubAdminToken, verifySubAdminOtpToken, pendingRegistrations };
