import express from "express";
import {
	getFinanceList,
	getFinanceStatement,
	createEmiEntry,
	getCollectionAgents,
	saveCollectionEntry,
	getCollectionEntries,
	updateCollectionEntry,
	deleteCollectionEntry,
	clearCollectionEntries,
} from "../../controllers/SubAdminManagementController/financeController.js";
import { verifySubAdminToken, checkModuleEditPermission } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

// 🔐 Protected read routes - SubAdmin must be authenticated
router.get("/finance", verifySubAdminToken, getFinanceList);
router.get("/finance/collection-agents", verifySubAdminToken, getCollectionAgents);
router.get("/finance/collection-entries", verifySubAdminToken, getCollectionEntries);
router.get("/finance/:buyerId", verifySubAdminToken, getFinanceStatement);

// 🔐 Protected write routes - Requires authentication + edit permission for 'finance' module
router.post("/finance/collection-entry", verifySubAdminToken, checkModuleEditPermission("finance"), saveCollectionEntry);
router.patch("/finance/collection-entry/:id", verifySubAdminToken, checkModuleEditPermission("finance"), updateCollectionEntry);
router.delete("/finance/collection-entry/:id", verifySubAdminToken, checkModuleEditPermission("finance"), deleteCollectionEntry);
router.delete("/finance/collection-entries", verifySubAdminToken, checkModuleEditPermission("finance"), clearCollectionEntries);
router.post("/finance/emi-entry", verifySubAdminToken, checkModuleEditPermission("finance"), createEmiEntry);

export default router;
