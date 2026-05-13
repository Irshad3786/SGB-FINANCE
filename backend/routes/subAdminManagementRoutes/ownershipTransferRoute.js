import express from 'express';
import { verifySubAdminToken, checkModuleEditPermission } from '../../middlewares/subAdminMiddleware.js';
import {
    createOwnershipTransfer,
    getAllOwnershipTransfers,
    getOwnershipTransferById,
    updateOwnershipTransfer,
    deleteOwnershipTransfer,
    getOwnershipTransfersByStatus
} from '../../controllers/SubAdminManagementController/ownershipTransferController.js';

const router = express.Router();

// 🔐 Protected read routes - SubAdmin must be authenticated
router.get('/all', verifySubAdminToken, getAllOwnershipTransfers);
router.get('/status/:status', verifySubAdminToken, getOwnershipTransfersByStatus);
router.get('/:id', verifySubAdminToken, getOwnershipTransferById);

// 🔐 Protected write routes - Requires authentication + edit permission for 'ownershipTransfer' module
router.post('/create', verifySubAdminToken, checkModuleEditPermission('ownershipTransfer'), createOwnershipTransfer);
router.put('/update/:id', verifySubAdminToken, checkModuleEditPermission('ownershipTransfer'), updateOwnershipTransfer);
router.delete('/delete/:id', verifySubAdminToken, checkModuleEditPermission('ownershipTransfer'), deleteOwnershipTransfer);

export default router;
