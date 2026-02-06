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

    return res.status(201).json({
      success: true,
      message: "OTP sent successfully. Please verify to complete registration.",
      token: otpToken,
    });
  } catch (error) {
    if (session.inTransaction()) {
    await session.abortTransaction();
    }
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
    const admin = req.admin; // ✅ injected by middleware



    // 🔒 Check OTP validity
    const isOtpValid = await admin.isOtpCorrect(otp);
    if (!isOtpValid || admin.otpExpiresAt < Date.now()) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // ✅ Mark admin as verified and clear OTP fields
    admin.otp = undefined;
    admin.otpExpiresAt = undefined;
    admin.isVerified = true;
    await admin.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Admin verified successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
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


const resendAdminOtp = async (req, res) => {
  try {
    const adminId = req.adminId; // From verifyOtp middleware

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin identifier missing. Cannot resend OTP",
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found. Please login again",
      });
    }

    // 🛡️ Prevent resend spam — 1 OTP every 60 seconds
    if (
      admin.lastOtpSentAt &&
      Date.now() - admin.lastOtpSentAt.getTime() < 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: "You can request a new OTP only once every 60 seconds.",
      });
    }

    // 📩 Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
    
    // Send OTP email
    const sendOtp = await sendAdminOtp(admin, otp);
    if (!sendOtp.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again !!",
      });
    }

    // ✅ Update timestamp
    admin.lastOtpSentAt = new Date();
    await admin.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your registered email !!",
    });
  } catch (error) {
    console.error("Error in resendAdminOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error !!",
      error: error.message,
    });
  }
};

export{
    registerAdmin ,verifyAdminOtp, resendAdminOtp
}
