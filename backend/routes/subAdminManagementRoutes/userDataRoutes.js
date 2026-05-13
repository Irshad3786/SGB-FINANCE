import express from "express";
import {
	getUserData,
	updateUserData,
	deleteUserData,
} from "../../controllers/SubAdminManagementController/userDataController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

// 🔐 Protected routes - SubAdmin must be authenticated
router.get("/users", verifySubAdminToken, getUserData);

// 🔐 Protected write operations - SubAdmin must be authenticated
router.put("/users", verifySubAdminToken, updateUserData);
router.delete("/users", verifySubAdminToken, deleteUserData);

export default router;
