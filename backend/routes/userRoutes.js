import express from "express";
import {
	registerUser,
	loginUser,
	refreshUserToken,
	logOutUser,
	getCurrentUser,
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

// 🔐 Public routes - No authentication required
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-User-Token", refreshUserToken);
router.post("/logOutUser", logOutUser);
router.post("/forgot-User-Password", forgotUserPassword);
router.post("/reset-User-Password/:token", resetUserPassword);
router.post("/finance-by-vehicle", getUserFinanceByVehicle);
router.post("/send-otp", sendUserOtp);
router.post("/verify-otp", verifyUserOtp);
router.get("/requests/my-public", getPublicMyRequests);

// 🔐 Protected routes - Authentication required
router.post("/requests/contact", verifyUserToken, createContactRequest);
router.post("/requests/finance", verifyUserToken, createFinanceRequest);
router.get("/requests/my", verifyUserToken, getMyRequests);
router.get("/me", verifyUserToken, getCurrentUser);

export default router;
