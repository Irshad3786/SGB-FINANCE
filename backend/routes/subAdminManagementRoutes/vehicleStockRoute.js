import express from "express";
import {
	addVehicleSpare,
	getVehicleStock,
	markVehicleAsSold,
	updateVehicleSpare,
} from "../../controllers/SubAdminManagementController/vehicleStockController.js";
import { verifySubAdminToken, checkModuleAccess, checkModuleEditPermission } from "../../middlewares/subAdminMiddleware.js";

const router = express.Router();

// 🔐 Protected routes - SubAdmin must be authenticated + have access to 'vehicleStock' module
router.get("/vehicle-stock", verifySubAdminToken, checkModuleAccess("vehicleStock"), getVehicleStock);

// 🔐 Protected write operations - SubAdmin must be authenticated + edit permission for 'vehicleStock' module
router.post("/vehicle-stock/:sellerId/spares", verifySubAdminToken, checkModuleEditPermission("vehicleStock"), addVehicleSpare);
router.put(
	"/vehicle-stock/:sellerId/spares/:spareIndex",
	verifySubAdminToken,
	checkModuleEditPermission("vehicleStock"),
	updateVehicleSpare
);
router.patch("/vehicle-stock/:sellerId/sold", verifySubAdminToken, checkModuleEditPermission("vehicleStock"), markVehicleAsSold);

export default router;
