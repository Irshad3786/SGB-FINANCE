import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SubAdmin from "../models/subAdminModel.js";
import { sendSubAdminOtp } from "../utils/authEmails/subAdminRegisterEmail.js";
import { pendingRegistrations } from "../middlewares/subAdminMiddleware.js";

const generateAccessAndRefreshToken = async (subAdminId) => {
  try {
    const subAdmin = await SubAdmin.findById(subAdminId);
    const accessToken = subAdmin.generateAccessToken();
    const refreshToken = subAdmin.generateRefreshToken();
    subAdmin.refreshToken = refreshToken;
    await subAdmin.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Token generation failed");
  }
};

const registerSubAdmin = async (req, res) => {
  try {
    const { name, phone, email, password, confirmPassword, roleName, permissions } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !phone || !email || !password || !confirmPassword || !roleName) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided (name, phone, email, password, confirmPassword, roleName)",
      });
    }

    // 2️⃣ Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 3️⃣ Check if SubAdmin already exists
    const existingSubAdmin = await SubAdmin.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingSubAdmin) {
      return res.status(400).json({
        success: false,
        message: "Sub-Admin with this email or phone already exists",
      });
    }

    // 4️⃣ Validate roleName
    const validRoles = ["Financer", "Collection Agent", "Data Entry"];
    if (!validRoles.includes(roleName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      });
    }

    // 5️⃣ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 6️⃣ Hash OTP for storage
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 7️⃣ Store registration data temporarily
    const registrationId = `subadmin_${email}_${Date.now()}`;
    const otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
    
    pendingRegistrations.set(registrationId, {
      name,
      phone,
      email,
      password,
      roleName,
      permissions: permissions || [],
      hashedOtp,
      otpExpiresAt,
      createdAt: Date.now()
    });

    // 8️⃣ Try sending OTP email
    try {
      const tempSubAdmin = { name, email };
      const emailResponse = await sendSubAdminOtp(tempSubAdmin, otp);
      if (!emailResponse.success) {
        throw new Error("Failed to send OTP email");
      }
    } catch (emailError) {
      pendingRegistrations.delete(registrationId);
      return res.status(500).json({
        success: false,
        message: "OTP email could not be sent. Registration aborted.",
        error: emailError.message,
      });
    }

    // 9️⃣ Generate token with registration ID
    const otpToken = jwt.sign(
      { registrationId, email },
      process.env.OTP_TOKEN_SECRET,
      { expiresIn: process.env.OTP_TOKEN_EXPIRY || "10m" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please verify to complete registration.",
      token: otpToken,
    });
  } catch (error) {
    console.error("registerSubAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during sub-admin registration",
      error: error.message,
    });
  }
};

const verifySubAdminOtp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { otp } = req.body;
    const registrationId = req.registrationId; // ✅ injected by middleware

    // 1️⃣ Get pending registration data
    const pendingData = pendingRegistrations.get(registrationId);
    
    if (!pendingData) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Registration session expired or invalid. Please register again.",
      });
    }

    // 2️⃣ Check OTP expiry
    if (pendingData.otpExpiresAt < Date.now()) {
      pendingRegistrations.delete(registrationId);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // 3️⃣ Verify OTP
    const isOtpValid = await bcrypt.compare(otp, pendingData.hashedOtp);
    if (!isOtpValid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // 4️⃣ Create SubAdmin in database
    const [subAdmin] = await SubAdmin.create(
      [
        {
          name: pendingData.name,
          phone: pendingData.phone,
          email: pendingData.email,
          password: pendingData.password,
          roleName: pendingData.roleName,
          permissions: pendingData.permissions,
          isVerified: true,
          status: "active"
        },
      ],
      { session }
    );

    // 5️⃣ Clean up pending registration
    pendingRegistrations.delete(registrationId);

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Sub-Admin verified and created successfully",
      subAdmin: {
        id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        roleName: subAdmin.roleName,
      },
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const resendSubAdminOtp = async (req, res) => {
  try {
    const registrationId = req.registrationId; // From middleware

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: "Registration session identifier missing. Cannot resend OTP",
      });
    }

    // 1️⃣ Get pending registration data
    const pendingData = pendingRegistrations.get(registrationId);
    
    if (!pendingData) {
      return res.status(404).json({
        success: false,
        message: "Registration session not found or expired. Please register again.",
      });
    }

    // 2️⃣ Prevent resend spam — 1 OTP every 60 seconds
    if (
      pendingData.lastOtpSentAt &&
      Date.now() - pendingData.lastOtpSentAt < 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: "You can request a new OTP only once every 60 seconds.",
      });
    }

    // 3️⃣ Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    // 4️⃣ Update pending registration
    pendingData.hashedOtp = hashedOtp;
    pendingData.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
    pendingData.lastOtpSentAt = Date.now();
    pendingRegistrations.set(registrationId, pendingData);

    // 5️⃣ Send OTP email
    const tempSubAdmin = { name: pendingData.name, email: pendingData.email };
    const sendOtp = await sendSubAdminOtp(tempSubAdmin, otp);
    
    if (!sendOtp.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your registered email !!",
    });
  } catch (error) {
    console.error("resendSubAdminOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

const loginSubAdmin = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // ✅ Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required",
      });
    }

    // ✅ Find subAdmin by email or phone - include password field
    const subAdmin = await SubAdmin.findOne({
      $or: [{ email }, { phone }],
    }).select('+password');

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found with this email or phone",
      });
    }

    // ✅ Check if subAdmin is active
    if (subAdmin.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active. Please contact admin.",
      });
    }

    // ✅ Compare password
    const isPasswordCorrect = await subAdmin.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // ✅ Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      subAdmin._id
    );

    // ✅ Set cookie options
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // ✅ Success response
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "SubAdmin logged in successfully",
        accessToken,
        refreshToken,
        data: {
          id: subAdmin._id,
          name: subAdmin.name,
          email: subAdmin.email,
          phone: subAdmin.phone,
          roleName: subAdmin.roleName,
        },
      });
  } catch (error) {
    console.error("Error in loginSubAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const refreshSubAdminToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No refresh token provided",
    });
  }

  try {
    // ✅ Verify refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // ✅ Find subAdmin
    const subAdmin = await SubAdmin.findById(decodedToken?._id);
    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found",
      });
    }

    // ✅ Check if incoming refresh token matches DB
    if (subAdmin.refreshToken !== incomingRefreshToken) {
      return res.status(403).json({
        success: false,
        message: "Refresh token has already been used or is invalid",
      });
    }

    // ✅ Generate new access & refresh tokens
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(subAdmin._id);

    // ✅ Set cookie options
    const isProd = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "New access and refresh tokens issued",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("refreshSubAdminToken error:", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: error.message,
    });
  }
};

const logOutSubAdmin = async (req, res) => {
  try {
    const subAdminId = req.subAdminId; // Set from auth middleware

    if (!subAdminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. SubAdmin ID missing",
      });
    }

    // ✅ Find and clear refreshToken
    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "SubAdmin not found",
      });
    }

    subAdmin.refreshToken = null;
    await subAdmin.save({ validateBeforeSave: false });

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
        message: "Logged out successfully",
      });
  } catch (error) {
    console.error("Error in logOutSubAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  generateAccessAndRefreshToken,
  registerSubAdmin,
  verifySubAdminOtp,
  resendSubAdminOtp,
  loginSubAdmin,
  refreshSubAdminToken,
  logOutSubAdmin
};