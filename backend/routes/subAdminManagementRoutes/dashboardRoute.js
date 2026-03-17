import express from "express";
import { getDashboardData } from "../../controllers/SubAdminManagementController/dashboardController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifySubAdminToken, getDashboardData);

export default router;
