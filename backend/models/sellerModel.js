import mongoose from 'mongoose';

const sellerUsedSpareSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    enteredDate: Date,
    modifiedDate: Date,
}, { _id: false });

const sellerSchema = new mongoose.Schema({
    fullName: String,
    sowoco:String,
    occupation: String,
    phoneNo: String,
    alternatePhoneNo: String,
    aadharNo: String,
    
    vehicle: {
    vehicleName: String,
    vehicleNumber: String,
    model: String,
    chassisNo: { type: String, unique: true },
    bikePrice: Number,
    usedSpares: {
    type: [sellerUsedSpareSchema],
    default: [],
        },
    status: {
    type: String,
    enum: ["available", "work", "sold"],
    default: "available"
        }
    },

    dateOfBirth: Date,
    district: String,
    mandal: String,
    street: String,
    fullAddress: String,
    aadharFront: String,
    aadharBack: String,
    profile: String,
    referralName: String,
    referralPhoneNo: String

})

const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);

export default Seller;