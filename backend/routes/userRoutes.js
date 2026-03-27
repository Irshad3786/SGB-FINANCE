import express from "express";
import {
	registerUser,
	loginUser,
	refreshUserToken,
	forgotUserPassword,
	resetUserPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-User-Token", refreshUserToken);
router.post("/forgot-User-Password", forgotUserPassword);
router.post("/reset-User-Password/:token", resetUserPassword);

export default router;
