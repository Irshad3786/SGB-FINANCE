import express from 'express';
import { verifySubAdminToken, checkModuleEditPermission, checkModuleAccess } from '../../middlewares/subAdminMiddleware.js';
import {
    createOwnershipTransfer,
    getAllOwnershipTransfers,
    getOwnershipTransferById,
    updateOwnershipTransfer,
    deleteOwnershipTransfer,
    getOwnershipTransfersByStatus
} from '../../controllers/SubAdminManagementController/ownershipTransferController.js';

const router = express.Router();

// 🔐 Protected read routes - SubAdmin must be authenticated + have access to 'ownershipTransfer' module
router.get('/all', verifySubAdminToken, checkModuleAccess('ownershipTransfer'), getAllOwnershipTransfers);
router.get('/status/:status', verifySubAdminToken, checkModuleAccess('ownershipTransfer'), getOwnershipTransfersByStatus);
router.get('/:id', verifySubAdminToken, checkModuleAccess('ownershipTransfer'), getOwnershipTransferById);

// 🔐 Protected write routes - Requires authentication + edit permission for 'ownershipTransfer' module
router.post('/create', verifySubAdminToken, checkModuleEditPermission('ownershipTransfer'), createOwnershipTransfer);
router.put('/update/:id', verifySubAdminToken, checkModuleEditPermission('ownershipTransfer'), updateOwnershipTransfer);
router.delete('/delete/:id', verifySubAdminToken, checkModuleEditPermission('ownershipTransfer'), deleteOwnershipTransfer);

export default router;
