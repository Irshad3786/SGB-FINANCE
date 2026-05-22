import express from "express";
import {
  getAllRequestsForManagement,
  updateRequestStatus,
  deleteRequestForManagement,
} from "../../controllers/requestController.js";
import { verifySubAdminToken, checkModuleEditPermission, checkModuleAccess } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

// 🔐 Protected read route - SubAdmin must be authenticated + have access to 'requestCenter' module
router.get("/requests", verifySubAdminToken, checkModuleAccess("requestCenter"), getAllRequestsForManagement);

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
