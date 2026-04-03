import express from "express";
import {
  getAllRequestsForManagement,
  updateRequestStatus,
  deleteRequestForManagement,
} from "../../controllers/requestController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/requests", verifySubAdminToken, getAllRequestsForManagement);
router.patch("/requests/:id/status", verifySubAdminToken, updateRequestStatus);
router.delete("/requests/:id", verifySubAdminToken, deleteRequestForManagement);

export default router;
