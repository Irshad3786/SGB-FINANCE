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

router.get("/finance", verifySubAdminToken, getFinanceList);
// Static routes MUST come before /:buyerId to avoid param conflicts
router.get("/finance/collection-agents", verifySubAdminToken, getCollectionAgents);
router.get("/finance/collection-entries", verifySubAdminToken, getCollectionEntries);
router.delete("/finance/collection-entries", verifySubAdminToken, checkModuleEditPermission("finance"), clearCollectionEntries);
router.post("/finance/collection-entry", verifySubAdminToken, checkModuleEditPermission("finance"), saveCollectionEntry);
router.patch("/finance/collection-entry/:id", verifySubAdminToken, checkModuleEditPermission("finance"), updateCollectionEntry);
router.delete("/finance/collection-entry/:id", verifySubAdminToken, checkModuleEditPermission("finance"), deleteCollectionEntry);
router.get("/finance/:buyerId", verifySubAdminToken, getFinanceStatement);
router.post("/finance/emi-entry", verifySubAdminToken, checkModuleEditPermission("finance"), createEmiEntry);

export default router;
