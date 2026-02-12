import express from "express";
import {
  registerSubAdmin,
  verifySubAdminOtp,
  resendSubAdminOtp
} from "../controllers/subAdminController.js";
import { verifyAdminToken } from "../middlewares/adminMiddleware.js";
import { verifySubAdminOtpToken } from "../middlewares/subAdminMiddleware.js";
import { otpRateLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

// Register subAdmin routes (admin creates subAdmin)
router.post("/registerSubAdmin", verifyAdminToken, registerSubAdmin);
router.post("/verifySubAdminOtp", verifySubAdminOtpToken, verifySubAdminOtp);

// Resend OTP route
router.post("/resendOtp", otpRateLimiter, verifySubAdminOtpToken, resendSubAdminOtp);

export default router;