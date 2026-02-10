import express from "express";
import { registerAdmin } from "../controllers/adminController.js";
import { verifyAdminOtp } from "../controllers/adminController.js";
import { verifyOtpToken } from "../middlewares/adminMiddleware.js";
import { otpRateLimiter } from "../middlewares/rateLimitMiddleware.js";
import { verifyOtp } from "../middlewares/adminMiddleware.js";
import { resendAdminOtp } from "../controllers/adminController.js";
import { loginAdmin } from "../controllers/adminController.js";
import { verifyAdmin } from "../controllers/adminController.js";
import { forgotAdminPassword } from "../controllers/adminController.js";
import { resetAdminPassword } from "../controllers/adminController.js";
import { verifyAdminToken } from "../middlewares/adminMiddleware.js";
import { changePassword } from "../controllers/adminController.js";
import { refreshAdminToken } from "../controllers/adminController.js";
// import {
//   registerAdmin,
//   verifyAdminOtp,
//   loginAdmin,
//   verifyAdmin,
//   resendAdminOtp,
//   refreshAccessToken,
//   forgotAdminPassword,
//   resetAdminPassword,
//   changePassword,
//   logOutAdmin,
// } from "../../controllers/superAdminControllers/admin.controller.js";
// import {verifyAdminToken, verifyOtp, verifyOtpToken } from "../../middlewares/admin.middleware.js";
// import { otpRateLimiter } from "../../middlewares/rateLimiter.middleware.js";
const router = express.Router();

// register admin routes
router.post("/registerAdmin", registerAdmin);
router.post("/verifyAdminOtp", verifyOtpToken, verifyAdminOtp);

// // login admin routes
router.post("/loginAdmin",loginAdmin);
router.post("/verifyAdmin", otpRateLimiter, verifyOtp, verifyAdmin); // 🧠 rate limiter added
router.post("/resendOtp", otpRateLimiter, verifyOtp, resendAdminOtp); // 🧠 rate limiter added
// // forgot and reset password routes
router.post("/refresh-Admin-Token", refreshAdminToken);
router.post("/forgot-Admin-Password",forgotAdminPassword);
router.post("/reset-Admin-Password/:token",resetAdminPassword);
router.post("/change-admin-password",verifyAdminToken,changePassword);

// // logout admin route
// router.post("/logOutAdmin",verifyAdminToken,logOutAdmin);

export default router;
