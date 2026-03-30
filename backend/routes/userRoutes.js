import express from "express";
import {
	registerUser,
	loginUser,
	refreshUserToken,
	forgotUserPassword,
	resetUserPassword,
	getUserFinanceByVehicle,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-User-Token", refreshUserToken);
router.post("/forgot-User-Password", forgotUserPassword);
router.post("/reset-User-Password/:token", resetUserPassword);
router.post("/finance-by-vehicle", getUserFinanceByVehicle);

export default router;
