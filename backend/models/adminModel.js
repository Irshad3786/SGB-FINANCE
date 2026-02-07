import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true
    },
    name:{
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
 
      
    },
    secretCode: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      default: "",
    },
    otp: {
      type: String, // hashed OTP
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    otpAttemptCount: {
      type: Number,
      default: 0, // Tracks wrong OTP attempts per session
    },
    otpBlockedUntil: {
      type: Date,
      default: null, // Timestamp until which OTP verification is blocked
    },
    lastOtpSentAt: {
      type: Date,
      default: null, // Tracks when last OTP was sent (to prevent spam resend)
    },
    role: {
      type: String,
      default: "admin",
      immutable: true 
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);




adminSchema.pre("save", async function () {
  // hash password only if not already hashed
  if (this.isModified("password") && !this.password.startsWith("$2b$")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  // hash secretCode only if not already hashed
  if (this.isModified("secretCode") && !this.secretCode.startsWith("$2b$")) {
    this.secretCode = await bcrypt.hash(this.secretCode, 12);
  }
  // hash otp only if not already hashed
  if (this.isModified("otp") && this.otp && !this.otp.startsWith("$2b$")) {
    this.otp = await bcrypt.hash(this.otp.toString(), 10);
  }
});


adminSchema.methods.isPasswordCorrect = async function (inputPassword) {
  return await bcrypt.compare(inputPassword.toString(), this.password);
};

// 🔐 Compare OTP
adminSchema.methods.isOtpCorrect = async function (plainOtp) {
  return await bcrypt.compare(plainOtp.toString(), this.otp);
};

// 🔑 Generate Access Token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// 🔄 Generate Refresh Token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// 🔑 Generate OTP token
adminSchema.methods.generateOtpToken = function () {
  return jwt.sign({ _id: this._id }, process.env.OTP_TOKEN_SECRET, {
    expiresIn: process.env.OTP_TOKEN_EXPIRY,
  });
};



const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
