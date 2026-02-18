import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const getTokenFromRequest = (req) => {
  const tokenFromBody = req.body?.token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const tokenFromCookie = req.cookies?.accessToken;
  return tokenFromBody || tokenFromHeader || tokenFromCookie;
};

const decodeToken = (token, secret) => {
  if (!token) {
    throw new Error("No token provided");
  }
  if (!secret) {
    throw new Error("JWT secret is not defined in environment variables");
  }
  return jwt.verify(token, secret);
};

const verifyUserToken = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    const decoded = decodeToken(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id || decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    req.user = user;
    req.userId = user._id;
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

export { verifyUserToken };
