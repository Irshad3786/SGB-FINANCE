import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel";

const registerAdmin = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fullName, email, designation, password, confirmPassword } = req.body;

    // 1️⃣ Validate required fields
    if (!fullName || !email || !designation || !password || !confirmPassword) {
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

    // 4️⃣ Block if any PendingAdmin exists
    const pendingCount = await PendingAdmin.countDocuments().session(session);
    if (pendingCount > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message:
          "An Admin registration is already in progress. Please complete OTP verification.",
      });
    }

    // 5️⃣ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create pendingAdmin entry inside session
    const [pendingAdmin] = await PendingAdmin.create(
      [
        {
          fullName,
          email,
          designation,
          password, // 🔒 hashed in schema
          otp, // 🔒 hashed in schema
          otpExpiresAt: Date.now() + 5 * 60 * 1000, // 5 min expiry
        },
      ],
      { session }
    );

    // 6️⃣ Try sending OTP email
    try {
      const emailResponse = await sendAdminOtp(pendingAdmin, otp);
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
    const otpToken = pendingAdmin.generateOtpToken();

    return res.status(201).json({
      success: true,
      message: "OTP sent successfully. Please verify to complete registration.",
      otpToken, // short-lived JWT (contains pendingAdmin._id)
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

export{
    registerAdmin
}