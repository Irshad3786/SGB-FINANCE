import express from 'express';
import { verifySubAdminToken } from '../../middlewares/subAdminMiddleware.js';
import {
    createOwnershipTransfer,
    getAllOwnershipTransfers,
    getOwnershipTransferById,
    updateOwnershipTransfer,
    deleteOwnershipTransfer,
    getOwnershipTransfersByStatus
} from '../../controllers/SubAdminManagementController/ownershipTransferController.js';

const router = express.Router();

// Create a new ownership transfer
router.post('/create', verifySubAdminToken, createOwnershipTransfer);

// Get all ownership transfers for the sub-admin
router.get('/all', verifySubAdminToken, getAllOwnershipTransfers);

// Get ownership transfers by status
router.get('/status/:status', verifySubAdminToken, getOwnershipTransfersByStatus);

// Get a specific ownership transfer by ID
router.get('/:id', verifySubAdminToken, getOwnershipTransferById);

// Update an ownership transfer
router.put('/update/:id', verifySubAdminToken, updateOwnershipTransfer);

// Delete an ownership transfer
router.delete('/delete/:id', verifySubAdminToken, deleteOwnershipTransfer);

export default router;
