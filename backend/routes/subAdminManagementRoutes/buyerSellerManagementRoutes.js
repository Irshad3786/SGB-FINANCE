import express from "express";
import {
	getNextAgreementNumber,
	getRefinancePrefillData,
	getVehiclePrefillData,
	saveBuyer,
	saveSeller,
} from "../../controllers/SubAdminManagementController/buyerSellerManagementController.js";
import { verifySubAdminToken, checkModuleAccess, checkModuleEditPermission } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

// 🔐 Protected routes - SubAdmin must be authenticated + have access to 'addEntry' module
router.get("/next-agreement-number", verifySubAdminToken, checkModuleAccess("addEntry"), getNextAgreementNumber);
router.get("/refinance-prefill", verifySubAdminToken, checkModuleAccess("addEntry"), getRefinancePrefillData);
router.get("/vehicle-prefill", verifySubAdminToken, checkModuleAccess("addEntry"), getVehiclePrefillData);

// 🔐 Protected write operations - SubAdmin must be authenticated + edit permission for 'addEntry' module
router.post("/save-buyer", verifySubAdminToken, checkModuleEditPermission("addEntry"), saveBuyer);
router.post("/save-seller", verifySubAdminToken, checkModuleEditPermission("addEntry"), saveSeller);

export default router;
