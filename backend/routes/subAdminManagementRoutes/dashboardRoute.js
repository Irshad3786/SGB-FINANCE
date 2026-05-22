import express from "express";
import { getDashboardData } from "../../controllers/SubAdminManagementController/dashboardController.js";
import { verifySubAdminToken, checkModuleAccess } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

// 🔐 Protected route - SubAdmin must be authenticated + have access to 'dashboard' module
router.get("/dashboard", verifySubAdminToken, checkModuleAccess("dashboard"), getDashboardData);

export default router;
