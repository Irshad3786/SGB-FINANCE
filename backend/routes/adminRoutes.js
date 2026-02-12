import express from "express";
import {
  registerAdmin,
  verifyAdminOtp,
  resendAdminOtp,
  loginAdmin,
  verifyAdmin,
  forgotAdminPassword,
  resetAdminPassword,
  changePassword,
  refreshAccessToken,
  logOutAdmin,
} from "../controllers/adminController.js";
import {
  verifyOtpToken,
  verifyOtp,
  verifyAdminToken,
} from "../middlewares/adminMiddleware.js";
import { otpRateLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

// register admin routes
router.post("/registerAdmin", registerAdmin);
router.post("/verifyAdminOtp", verifyOtpToken, verifyAdminOtp);

// // login admin routes
router.post("/loginAdmin",loginAdmin);
router.post("/verifyAdmin", otpRateLimiter, verifyOtp, verifyAdmin); // 🧠 rate limiter added
router.post("/resendOtp", otpRateLimiter, verifyOtp, resendAdminOtp); // 🧠 rate limiter added
// // forgot and reset password routes
router.post("/refresh-Admin-Token", refreshAccessToken);
router.post("/forgot-Admin-Password",forgotAdminPassword);
router.post("/reset-Admin-Password/:token",resetAdminPassword);
router.post("/change-admin-password",verifyAdminToken,changePassword);

// // logout admin route
router.post("/logOutAdmin",verifyAdminToken,logOutAdmin);

export default router;
