import express from "express";
import { registerUser, loginUser, refreshUserToken } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-User-Token", refreshUserToken);

export default router;
