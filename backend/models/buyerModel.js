import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
    name: String,
    sowoco:String,
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

    guarantor:{
        fullName: String,
        sowoco:String,
        phoneNo: String,
        dateOfBirth: Date,
        aadharNo: String,
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
        paid: { type: Boolean, default: false },
        paidDate: Date,
        paidAmount: Number,
        bookNo: String,
        pageNo: String,
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

        dpPayment:{
            amount: Number,
            dueDate: Date,
            commitmentDate: Date,

            status: {
                type: String,
                enum: ["pending", "paid", "overdue"],
                default: "pending"
            }
        },


})

const Buyer = mongoose.models.Buyer || mongoose.model('Buyer', buyerSchema);

export default Buyer;