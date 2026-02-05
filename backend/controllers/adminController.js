import mongoose from "mongoose";
import Admin from "../models/adminModel.js";
import { sendAdminOtp } from "../utils/authEmails/adminRegisterEmail.js";


const registerAdmin = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, phone, email, password, confirmPassword, secretCode } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !phone || !email || !password || !confirmPassword || !secretCode) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Validate password match
    if (password !== confirmPassword) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    
    // 3️⃣ Block if Admin already exists
    const existingAdmin = await Admin.countDocuments().session(session);
    if (existingAdmin > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "An Admin already exists. You cannot create another one.",
      });
    }

    // 5️⃣ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create admin entry inside session
    const [admin] = await Admin.create(
      [
        {
          name,
          phone,
          email,
          password, // 🔒 hashed in schema
          secretCode, // 🔒 hashed in schema
          otp, // 🔒 hashed in schema
          otpExpiresAt: Date.now() + 5 * 60 * 1000, // 5 min expiry
          lastOtpSentAt: new Date(),
        },
      ],
      { session }
    );

    // 6️⃣ Try sending OTP email
    try {
      const emailResponse = await sendAdminOtp(admin, otp);
      if (!emailResponse.success) {
        throw new Error("Failed to send OTP email");
      }
    } catch (emailError) {
      // rollback if email fails
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        success: false,
        message: "OTP email could not be sent. Registration aborted.",
        error: emailError.message,
      });
    }

    // 7️⃣ Commit transaction only if email + DB insert succeeded
    await session.commitTransaction();
    session.endSession();

    // 8️⃣ Generate short-lived token
    const otpToken = admin.generateOtpToken();

    // Send OTP token in Authorization header (Bearer)
    res.set("Authorization", `Bearer ${otpToken}`);

    return res.status(201).json({
      success: true,
      message: "OTP sent successfully. Please verify to complete registration.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("registerAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin registration",
      error: error.message,
    });
  }
};



const verifyAdminOtp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { otp } = req.body;
    const pendingAdmin = req.pendingAdmin; // ✅ injected by middleware

    console.log(otp);
    

    // 🔒 Check OTP validity
    const isOtpValid = await pendingAdmin.isOtpCorrect(otp);
    if (!isOtpValid || pendingAdmin.otpExpiresAt < Date.now()) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // 🚫 Ensure no Admin already exists
    const adminExists = await Admin.countDocuments().session(session);
    if (adminExists > 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    // ✅ Create Admin from PendingAdmin
    const newAdmin = new Admin({
      fullName: pendingAdmin.fullName,
      email: pendingAdmin.email,
      designation: pendingAdmin.designation,
      password: pendingAdmin.password, // already hashed
    });
    await newAdmin.save({ session });

    // 🗑️ Delete PendingAdmin doc after success
    await PendingAdmin.deleteOne({ _id: pendingAdmin._id }).session(session);

    await session.commitTransaction();
    session.endSession();

    // 📩 Send success email (not blocking transaction)
    sendAdminSuccessEmail().catch((err) =>
      console.error("Email sending failed:", err)
    );

    return res.status(201).json({
      success: true,
      message: "Admin verified & created successfully",
      admin: {
        id: newAdmin._id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        designation: newAdmin.designation,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export{
    registerAdmin ,verifyAdminOtp
}
