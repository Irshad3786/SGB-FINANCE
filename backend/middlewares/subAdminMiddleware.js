import jwt from "jsonwebtoken";

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

export { verifySubAdminOtpToken, pendingRegistrations };
