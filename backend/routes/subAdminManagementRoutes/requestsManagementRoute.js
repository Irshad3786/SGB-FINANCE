import express from "express";
import {
  getAllRequestsForManagement,
  updateRequestStatus,
  deleteRequestForManagement,
} from "../../controllers/requestController.js";
import { verifySubAdminToken, checkModuleEditPermission } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/requests", verifySubAdminToken, getAllRequestsForManagement);
router.patch(
  "/requests/:id/status",
  verifySubAdminToken,
  checkModuleEditPermission("requestCenter"),
  updateRequestStatus
);
router.delete(
  "/requests/:id",
  verifySubAdminToken,
  checkModuleEditPermission("requestCenter"),
  deleteRequestForManagement
);

export default router;
