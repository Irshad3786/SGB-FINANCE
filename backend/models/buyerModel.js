import mongoose from 'mongoose';

const dpPaymentSchema = new mongoose.Schema({
    amount: Number,
    dueDate: Date,
    commitmentDate: Date,
    status: {
        type: String,
        enum: ["pending", "paid", "overdue"],
        default: "pending"
    }
}, { _id: false });

const usedSpareSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    enteredDate: Date,
    modifiedDate: Date,
}, { _id: false });

const buyerSchema = new mongoose.Schema({
    name: String,
    sowoco:String,
    occupation: String,
    mode: {
        type: String,
        enum: ["refinance", "buy"],
        default: "buy"
    },
    agreementNo: { type: String, unique: true },
    phoneNo: String,
    alternatePhoneNo: String,
    aadharNo: String,
    soldamount:Number,
    oldHAnumber:String,

    dateOfBirth: Date,
    district: String,
    mandal: String,
    street: String,
    fullAddress: String,

    aadharFront: String,
    aadharBack: String,
    profile: String,

    referralName: String,
    referralPhoneNo: String,

    vehicle: {
        vehicleName: String,
        vehicleNumber: String,
        model: String,
        chassisNo: String,
        bikePrice: Number,
        usedSpares: {
            type: [usedSpareSchema],
            default: [],
        },
        
    },

    guarantor:{
        fullName: String,
        sowoco:String,
        occupation: String,
        phoneNo: String,
        alternatePhoneNo: String,
        dateOfBirth: Date,
        aadharNo: String,
        district: String,
        mandal: String,
        address: String,
        guarantorPhoto: String
    },
    finance:{
        financeAmount: Number,
        totalAmount: Number,
        emiAmount: Number,
        months: Number,
        emiStartDate: Date,


       

        emiDates: [{
        emiNo: Number,
        emiDate: Date,
        amount: { type: Number, default: 0 },
        paid: { type: Boolean, default: false },
        paidDate: { type: Date, default: null },
        paidAmount: { type: Number, default: 0 },
        bookNo: String,
        pageNo: String,
        }],

        paymentEntries: [{
        paidDate: { type: Date, default: null },
        amount: { type: Number, default: 0 },
        bookNo: { type: String, default: "" },
        pageNo: { type: String, default: "" },
        emiNo: Number,
        }],

        agentName: String,
        emiNo: Number,
        commitmentDate: Date,
        emiDate: Date,
        amount: Number,
        paidAmount: Number,
        status: {
            type: String,
            enum: ["paid", "pending", "seized", "marked"],
            default: "pending"
        }
        },

        dpPayment: {
            type: dpPaymentSchema,
            default: undefined,
        },

})

const Buyer = mongoose.models.Buyer || mongoose.model('Buyer', buyerSchema);

export default Buyer;