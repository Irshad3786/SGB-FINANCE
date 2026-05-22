import express from "express";
import {
	getUserData,
	updateUserData,
	deleteUserData,
} from "../../controllers/SubAdminManagementController/userDataController.js";
import { verifySubAdminToken, checkModuleAccess, checkModuleEditPermission } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

// 🔐 Protected routes - SubAdmin must be authenticated + have access to 'users' module
router.get("/users", verifySubAdminToken, checkModuleAccess("users"), getUserData);

// 🔐 Protected write operations - SubAdmin must be authenticated + edit permission for 'users' module
router.put("/users", verifySubAdminToken, checkModuleEditPermission("users"), updateUserData);
router.delete("/users", verifySubAdminToken, checkModuleEditPermission("users"), deleteUserData);

export default router;
