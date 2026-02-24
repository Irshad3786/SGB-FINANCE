import express from "express";
import {
  registerSubAdmin,
  verifySubAdminOtp,
  resendSubAdminOtp,
  loginSubAdmin,
  refreshSubAdminToken,
  logOutSubAdmin,
} from "../controllers/subAdminController.js";
import { verifyAdminToken } from "../middlewares/adminMiddleware.js";
import { verifySubAdminToken, verifySubAdminOtpToken } from "../middlewares/subAdminMiddleware.js";
import { otpRateLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

// Register subAdmin routes (admin creates subAdmin)
router.post("/registerSubAdmin", verifyAdminToken, registerSubAdmin);
router.post("/verifySubAdminOtp", verifySubAdminOtpToken, verifySubAdminOtp);

// Resend OTP route
router.post("/resendOtp", otpRateLimiter, verifySubAdminOtpToken, resendSubAdminOtp);

// Login subAdmin routes (No OTP required)
router.post("/loginSubAdmin", loginSubAdmin);

// Refresh token route
router.post("/refresh-SubAdmin-Token", refreshSubAdminToken);

// Logout route
router.post("/logOutSubAdmin", verifySubAdminToken, logOutSubAdmin);

export default router;