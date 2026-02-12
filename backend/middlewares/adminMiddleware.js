import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";

// 🔐 Get token from request body, Authorization header, or cookie
const getTokenFromRequest = (req) => {
  const tokenFromBody = req.body?.token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const tokenFromCookie = req.cookies?.accessToken;
  return tokenFromBody || tokenFromHeader || tokenFromCookie; // 🔧 Request body takes priority
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

const verifyAdminToken = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    const decoded = decodeToken(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findById(decoded._id || decoded.id);
    if(!admin){
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Admin not found",
      });
    }

    // add admin to req object
    req.admin = admin;
    req.adminId = admin._id;
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
}

// for otp verify mainly for reset password
const verifyOtp = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    const decoded = decodeToken(token, process.env.OTP_TOKEN_SECRET);
    const admin = await Admin.findById(decoded._id || decoded.id);
    if(!admin){
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Admin not found",
      });
    }

    // add admin to req object
    req.admin = admin;
    req.adminId = admin._id;
    next();
  } catch (error) {
    console.error("OTP token error:", error.message);
    const message =
      error.name === "TokenExpiredError"
        ? "OTP token has expired"
        : error.name === "JsonWebTokenError"
        ? "Invalid OTP token"
        : error.message;
    return res.status(401).json({ success: false, message });
  }
};

// for register and verifyAdminOtp routes only uses Admin model
const verifyOtpToken = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // 🔑 Decode token
    const decoded = decodeToken(token, process.env.OTP_TOKEN_SECRET);

    // 🔎 Find admin
    const admin = await Admin.findById(decoded._id || decoded.id);
    if (!admin) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Admin not found or expired",
        });
    }

    // ✅ Attach to request object
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export {verifyAdminToken, verifyOtp, verifyOtpToken};
