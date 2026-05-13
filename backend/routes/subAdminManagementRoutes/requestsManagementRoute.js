import express from "express";
import {
  getAllRequestsForManagement,
  updateRequestStatus,
  deleteRequestForManagement,
} from "../../controllers/requestController.js";
import { verifySubAdminToken, checkModuleEditPermission } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

// 🔐 Protected read route - SubAdmin must be authenticated
router.get("/requests", verifySubAdminToken, getAllRequestsForManagement);

// 🔐 Protected write routes - Requires authentication + edit permission for 'requestCenter' module
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
