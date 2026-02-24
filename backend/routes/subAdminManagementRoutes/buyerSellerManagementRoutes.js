import express from "express";
import { saveBuyer, saveSeller } from "../../controllers/SubAdminManagementController/buyerSellerManagementController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.post("/save-buyer", verifySubAdminToken, saveBuyer);
router.post("/save-seller", verifySubAdminToken, saveSeller);

export default router;
