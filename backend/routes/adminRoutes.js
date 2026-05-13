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

// 🔐 Public routes - No authentication required
router.post("/registerAdmin", registerAdmin);
router.post("/verifyAdminOtp", verifyOtpToken, verifyAdminOtp);
router.post("/loginAdmin", loginAdmin);
router.post("/verifyAdmin", otpRateLimiter, verifyOtp, verifyAdmin);
router.post("/resendOtp", otpRateLimiter, verifyOtp, resendAdminOtp);
router.post("/forgot-Admin-Password", forgotAdminPassword);
router.post("/reset-Admin-Password/:token", resetAdminPassword);
router.post("/refresh-Admin-Token", refreshAccessToken);

// 🔐 Protected routes - Authentication required
router.post("/change-admin-password", verifyAdminToken, changePassword);
router.post("/logOutAdmin", verifyAdminToken, logOutAdmin);

// 🔐 Protected SubAdmin Management routes
router.get("/subadmins", verifyAdminToken, getCreatedSubAdmins);
router.put("/subadmins/:id", verifyAdminToken, updateCreatedSubAdmin);

// 🔐 Protected District/Mandal Management routes
router.get("/district-locations", verifyAdminToken, getDistrictLocations);
router.get("/district-locations/:district/mandals", verifyAdminToken, getDistrictMandals);
router.post("/district-locations", verifyAdminToken, createDistrictLocation);
router.put("/district-locations/:id", verifyAdminToken, updateDistrictLocation);
router.delete("/district-locations/:id", verifyAdminToken, deleteDistrictLocation);

export default router;
