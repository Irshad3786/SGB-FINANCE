import express from "express";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";
import { uploadSingleApplicationFile } from "../../middlewares/applicationUploadMiddleware.js";
import { getSignedUrlForKey, uploadApplicationDocument } from "../../controllers/SubAdminManagementController/uploadController.js";

const router = express.Router();

// POST /api/subadmin/management/uploads
router.post(
  "/uploads",
  verifySubAdminToken,
  uploadSingleApplicationFile("file"),
  uploadApplicationDocument
);

// GET /api/subadmin/management/uploads/signed-url?key=applications/...
router.get(
  "/uploads/signed-url",
  verifySubAdminToken,
  getSignedUrlForKey
);

export default router;
