import express from "express";
import {
	getFinanceList,
	getFinanceStatement,
} from "../../controllers/SubAdminManagementController/financeController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/finance", verifySubAdminToken, getFinanceList);
router.get("/finance/:buyerId", verifySubAdminToken, getFinanceStatement);

export default router;
