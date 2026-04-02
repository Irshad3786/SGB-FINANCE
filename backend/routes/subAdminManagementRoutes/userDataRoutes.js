import express from "express";
import {
	getUserData,
	updateUserData,
	deleteUserData,
} from "../../controllers/SubAdminManagementController/userDataController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/users", verifySubAdminToken, getUserData);
router.put("/users", verifySubAdminToken, updateUserData);
router.delete("/users", verifySubAdminToken, deleteUserData);

export default router;
