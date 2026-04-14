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
import {
  getCreatedSubAdmins,
  updateCreatedSubAdmin,
} from "../controllers/AdminManagementController/subAdminManagementController.js";
import {
  createDistrictLocation,
  deleteDistrictLocation,
  getDistrictLocations,
  getDistrictMandals,
  updateDistrictLocation,
} from "../controllers/AdminManagementController/districtLocationController.js";
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

// created sub-admin management routes
router.get("/subadmins", verifyAdminToken, getCreatedSubAdmins);
router.put("/subadmins/:id", verifyAdminToken, updateCreatedSubAdmin);

// district / mandal management routes
router.get("/district-locations", verifyAdminToken, getDistrictLocations);
router.get("/district-locations/:district/mandals", verifyAdminToken, getDistrictMandals);
router.post("/district-locations", verifyAdminToken, createDistrictLocation);
router.put("/district-locations/:id", verifyAdminToken, updateDistrictLocation);
router.delete("/district-locations/:id", verifyAdminToken, deleteDistrictLocation);

export default router;
