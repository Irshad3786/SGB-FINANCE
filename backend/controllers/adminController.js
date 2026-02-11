import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import { sendAdminOtp } from "../utils/authEmails/adminRegisterEmail.js";
import AdminOtpVerifyEmail from "../utils/authEmails/adminOtpVerification.js";
import AdminPasswordResetEmail from "../utils/authEmails/sendAdminResetPasswordEmail.js";



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

    if (!admin.otp || !admin.otpExpiresAt || admin.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP missing or expired. Please request a new OTP.",
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




const forgotAdminPassword = async (req,res) => {
    try {
    const { email } = req.body;

    // ✅ Validate email presence
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ✅ Find user by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(500).json({
        success: false,
        message: "No user registered with this email",
      });
    }

    // ✅ Send reset email or OTP only if user is verified
    const result = await AdminPasswordResetEmail(admin); // handles OTP or token generation & sending
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Reset Email sent Successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



const resetAdminPassword = async (req,res) => {
      try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params; // ⬅️ Get token from URL params

    // ✅ Validate required fields
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, password, and confirmPassword are required.",
      });
    }

    // ✅ Validate password format
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // ✅ Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword do not match.",
      });
    }

    // ✅ Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // ✅ Find user by token payload
    const admin = await Admin.findById(payload.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // ✅ Update and hash new password (will trigger pre-save middleware)
    admin.password = password;
    await admin.save();

    return res.status(200).json({
      success: true,
      message:"Password has been reset successfully !!, Now you can Login",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};





const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const adminId = req.adminId; // set from auth middleware
    if(!adminId){
      return res.status(401).json({
         success: false,
          message: "Unauthorized. Admin ID missing !!",
      })
    }
    // Validate input presence
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Get user from request
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Check current password
    const isPasswordCorrect = await admin.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Validate new password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    // Check new vs confirm
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Update password (hashed via pre-save hook)
    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No refresh token provided",
    });
  }

  try {
    // 1️⃣ Verify refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 2️⃣ Find user
    const admin = await Admin.findById(decodedToken?._id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin  not found",
      });
    }

    // 3️⃣ Check if incoming refresh token matches DB
    if (admin.refreshToken !== incomingRefreshToken) {
      return res.status(403).json({
        success: false,
        message: "Refresh token has already been used or is invalid",
      });
    }

    // 4️⃣ Generate new access & refresh tokens
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(admin._id);

    // 5️⃣ Save new refresh token in DB (invalidate old one)
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    // 6️⃣ Send new tokens
    const isProd = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "New access and refresh tokens issued",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("❌ refreshAccessToken error:", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: error.message,
    });
  }
};



const logOutAdmin = async (req,res) => {
    try {
    const adminId = req.adminId; // set from auth middleware (decoded token)

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. SubAdmin ID missing !!",
      });
    }

    // ✅ Find and clear refreshToken
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found !!",
      });
    }

    admin.refreshToken = null;
    await admin.save({ validateBeforeSave: false });

    // ✅ Clear cookies
    const isProd = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "Logged out successfully !!",
      });
  } catch (error) {
    console.error("Error in logOutSubAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error !!",
      error: error.message,
    });
  }
};

export{
    registerAdmin ,verifyAdminOtp, resendAdminOtp, loginAdmin, verifyAdmin, forgotAdminPassword, resetAdminPassword, changePassword, refreshAccessToken, logOutAdmin
}
