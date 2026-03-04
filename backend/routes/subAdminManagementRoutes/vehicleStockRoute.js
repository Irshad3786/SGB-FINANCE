import express from "express";
import {
	addVehicleSpare,
	getVehicleStock,
	markVehicleAsSold,
	updateVehicleSpare,
} from "../../controllers/SubAdminManagementController/vehicleStockController.js";
import { verifySubAdminToken } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

router.get("/vehicle-stock", verifySubAdminToken, getVehicleStock);
router.post("/vehicle-stock/:sellerId/spares", verifySubAdminToken, addVehicleSpare);
router.put(
	"/vehicle-stock/:sellerId/spares/:spareIndex",
	verifySubAdminToken,
	updateVehicleSpare
);
router.patch("/vehicle-stock/:sellerId/sold", verifySubAdminToken, markVehicleAsSold);

export default router;
