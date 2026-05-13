import express from "express";
import {
  registerSubAdmin,
  verifySubAdminOtp,
  resendSubAdminOtp,
  loginSubAdmin,
  refreshSubAdminToken,
  logOutSubAdmin,
  getCurrentSubAdmin,
} from "../controllers/subAdminController.js";
import { verifyAdminToken } from "../middlewares/adminMiddleware.js";
import { verifySubAdminToken, verifySubAdminOtpToken } from "../middlewares/subAdminMiddleware.js";
import { otpRateLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

// 🔐 Protected routes - Only admin can create subadmins (requires admin token)
router.post("/registerSubAdmin", verifyAdminToken, registerSubAdmin);

// 🔐 Public routes - For subAdmin registration verification
router.post("/verifySubAdminOtp", verifySubAdminOtpToken, verifySubAdminOtp);
router.post("/resendOtp", otpRateLimiter, verifySubAdminOtpToken, resendSubAdminOtp);

// 🔐 Public routes - SubAdmin login
router.post("/loginSubAdmin", loginSubAdmin);
router.post("/refresh-SubAdmin-Token", refreshSubAdminToken);

// 🔐 Protected routes - SubAdmin authenticated operations
router.get("/me", verifySubAdminToken, getCurrentSubAdmin);
router.post("/logOutSubAdmin", verifySubAdminToken, logOutSubAdmin);

export default router;