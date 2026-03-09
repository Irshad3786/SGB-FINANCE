import express from "express";
import {
	getFinanceList,
	getFinanceStatement,
	createEmiEntry,
} from "../../controllers/SubAdminManagementController/financeController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/finance", verifySubAdminToken, getFinanceList);
router.get("/finance/:buyerId", verifySubAdminToken, getFinanceStatement);
router.post("/finance/emi-entry", verifySubAdminToken, createEmiEntry);

export default router;
