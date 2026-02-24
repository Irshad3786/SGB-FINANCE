import express from "express";
import { getUserData } from "../../controllers/SubAdminManagementController/userDataController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/users", verifySubAdminToken, getUserData);

export default router;
