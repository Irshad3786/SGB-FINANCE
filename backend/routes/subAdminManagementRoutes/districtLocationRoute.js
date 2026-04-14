import express from 'express'
import {
  getDistrictLocations,
  getDistrictMandals,
} from '../../controllers/AdminManagementController/districtLocationController.js'
import { verifySubAdminToken } from '../../middlewares/subAdminMiddleware.js'

const router = express.Router()

router.get('/district-locations', verifySubAdminToken, getDistrictLocations)
router.get('/district-locations/:district/mandals', verifySubAdminToken, getDistrictMandals)

export default router