import express from "express";
import {
	getUserData,
	updateUserData,
} from "../../controllers/SubAdminManagementController/userDataController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/users", verifySubAdminToken, getUserData);
router.put("/users", verifySubAdminToken, updateUserData);

export default router;
