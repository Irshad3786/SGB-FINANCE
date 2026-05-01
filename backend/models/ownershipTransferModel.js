import mongoose from 'mongoose';

const ownershipTransferSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    vehicleName: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    chassisNumber: {
        type: String,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
            enum: ["ekyc", "token", "challan", "finance approval", "rto approval", "completed"],
            default: "ekyc"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    subAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubAdmin',
        required: true
    },
    notes: String,
    documentPath: String
}, { timestamps: true });

const OwnershipTransfer = mongoose.model('OwnershipTransfer', ownershipTransferSchema);

export default OwnershipTransfer;
