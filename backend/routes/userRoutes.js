import express from "express";
import {
	registerUser,
	loginUser,
	refreshUserToken,
	forgotUserPassword,
	resetUserPassword,
	getUserFinanceByVehicle,
	sendUserOtp,
	verifyUserOtp,
} from "../controllers/userController.js";
import {
	createFinanceRequest,
	createContactRequest,
	getMyRequests,
	getPublicMyRequests,
} from "../controllers/requestController.js";
import { verifyUserToken } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-User-Token", refreshUserToken);
router.post("/forgot-User-Password", forgotUserPassword);
router.post("/reset-User-Password/:token", resetUserPassword);
router.post("/finance-by-vehicle", getUserFinanceByVehicle);
router.post("/send-otp", sendUserOtp);
router.post("/verify-otp", verifyUserOtp);
router.post("/requests/contact", createContactRequest);
router.post("/requests/finance", createFinanceRequest);
router.get("/requests/my", verifyUserToken, getMyRequests);
router.get("/requests/my-public", getPublicMyRequests);

export default router;
