import express from "express";
import {
	getNextAgreementNumber,
	getRefinancePrefillData,
	getVehiclePrefillData,
	saveBuyer,
	saveSeller,
} from "../../controllers/SubAdminManagementController/buyerSellerManagementController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

// 🔐 Protected routes - SubAdmin must be authenticated
router.get("/next-agreement-number", verifySubAdminToken, getNextAgreementNumber);
router.get("/refinance-prefill", verifySubAdminToken, getRefinancePrefillData);
router.get("/vehicle-prefill", verifySubAdminToken, getVehiclePrefillData);

// 🔐 Protected write operations - SubAdmin must be authenticated
router.post("/save-buyer", verifySubAdminToken, saveBuyer);
router.post("/save-seller", verifySubAdminToken, saveSeller);

export default router;
