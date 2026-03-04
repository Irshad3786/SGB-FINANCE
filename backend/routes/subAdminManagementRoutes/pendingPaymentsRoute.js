import express from "express";
import {
	getPendingPayments,
	updatePendingPaymentAmount,
	updatePendingPaymentCommitmentDate,
	updatePendingPaymentStatus,
} from "../../controllers/SubAdminManagementController/pendingPaymentsController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/pending-payments", verifySubAdminToken, getPendingPayments);
router.patch(
	"/pending-payments/:buyerId/amount",
	verifySubAdminToken,
	updatePendingPaymentAmount
);
router.patch(
	"/pending-payments/:buyerId/commitment-date",
	verifySubAdminToken,
	updatePendingPaymentCommitmentDate
);
router.patch(
	"/pending-payments/:buyerId/status",
	verifySubAdminToken,
	updatePendingPaymentStatus
);

export default router;
