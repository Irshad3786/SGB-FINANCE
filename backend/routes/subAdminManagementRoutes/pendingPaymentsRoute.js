import express from "express";
import {
	getPendingPayments,
	updatePendingPaymentAmount,
	updatePendingPaymentCommitmentDate,
	updatePendingPaymentStatus,
} from "../../controllers/SubAdminManagementController/pendingPaymentsController.js";
import { verifySubAdminToken, checkModuleEditPermission } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/pending-payments", verifySubAdminToken, getPendingPayments);
router.patch(
	"/pending-payments/:buyerId/amount",
	verifySubAdminToken,
	checkModuleEditPermission("pendingPayments"),
	updatePendingPaymentAmount
);
router.patch(
	"/pending-payments/:buyerId/commitment-date",
	verifySubAdminToken,
	checkModuleEditPermission("pendingPayments"),
	updatePendingPaymentCommitmentDate
);
router.patch(
	"/pending-payments/:buyerId/status",
	verifySubAdminToken,
	checkModuleEditPermission("pendingPayments"),
	updatePendingPaymentStatus
);

export default router;
