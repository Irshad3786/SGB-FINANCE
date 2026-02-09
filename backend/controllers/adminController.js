import mongoose from "mongoose";
import Admin from "../models/adminModel.js";
import { sendAdminOtp } from "../utils/authEmails/adminRegisterEmail.js";
import AdminOtpVerifyEmail from "../utils/authEmails/adminOtpVerification.js";



const generateAccessAndRefreshToken = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Token generation failed");
  }
};


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





const loginAdmin = async (req,res) => {
    try {
    const { email, password } = req.body;

    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or password is missing !!",
      });
    }

    // Find subAdmin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Email is not in use !!",
      });
    }
    // Compare password
    const isPasswordCorrect = await admin.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect !!",
      });
    }

    // Send OTP on email
    const sendOtp = await AdminOtpVerifyEmail(admin);
    if (!sendOtp.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again !!",
      });
    }

    // Generate short-lived OTP token
    const otpToken = await admin.generateOtpToken();

    // Success response
    return res.status(200).json({
      success: true,
      message: "OTP sent to your provided email !!",
      data:{
        id: admin._id,
        email: admin.email,
        otpToken
      }
    });
  } catch (error) {
    console.error("Error in login SubAdmin !!", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error !!",
      error: error.message,
    });
  }
};




const verifyAdmin = async (req, res) => {
  try {
    const { otp } = req.body;
    const adminId = req.adminId; // Set from verifyOtp middleware

    // 🔹 Basic validation
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required for verification",
      });
    }
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin identifier missing. Cannot verify OTP",
      });
    }

    // 🔹 Find admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found. Please request OTP again.",
      });
    }


    // 🧠 STEP 1: Brute-force protection (limit 3 wrong attempts)
    if (admin.otpBlockedUntil && admin.otpBlockedUntil > new Date()) {
      const remaining = Math.ceil(
        (admin.otpBlockedUntil - new Date()) / 60000
      );
      return res.status(429).json({
        success: false,
        message: `Account temporarily blocked due to multiple wrong OTPs. Try again after ${remaining} minute(s).`,
      });
    }

    
    // 🔐 STEP 2: Verify OTP correctness
    const isOtpValid = await admin.isOtpCorrect(otp);

    // ❌ Invalid OTP
    if (!isOtpValid) {
      admin.otpAttemptCount += 1;

      // 🚫 Block after 3 failed attempts
      if (admin.otpAttemptCount >= 3) {
        admin.otpBlockedUntil = new Date(Date.now() + 15 * 60 * 1000); // block for 15 mins
        admin.otpAttemptCount = 0; // reset counter
      }

      await admin.save({ validateBeforeSave: false });

      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP. Please try again.",
      });
    }

    // ✅ STEP 3: OTP verified successfully → clear security fields
    admin.otp = null;
    admin.otpExpiresAt = null;
    admin.otpAttemptCount = 0;
    admin.otpBlockedUntil = null;

    
    // 🎟️ STEP 4: Generate Tokens (unchanged logic)
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      admin._id
    );
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // ✅ Send success response - accessToken in body only, refreshToken in cookie
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "OTP verified successfully. Logged in.",
        accessToken,  // ✅ Send in response for frontend to store
        refreshToken, // ✅ Also in response body
        data: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
        },
      });
  } catch (error) {
    console.error("OTP Verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while verifying OTP.",
      error: error.message,
    });
  }
};

export{
    registerAdmin ,verifyAdminOtp, resendAdminOtp, loginAdmin, verifyAdmin
}
