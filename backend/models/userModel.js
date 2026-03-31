import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema( {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },


    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
      lowercase: true
    },

    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    vehicleName: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleManufactureYear: {
      type: Number,
      required: true,
      min: 1900,
      max: 2100,
    },

    chassisNumber: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    
    password: {
      type: String,
      required: true,
      select: false 
    },

    refreshToken: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "user",
      immutable: true 
    },


    isEmailVerified: {
      type: Boolean,
      default: false
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

  },
  { timestamps: true })

userSchema.pre("save", async function () {
  if (this.isModified("password") && !this.password.startsWith("$2b$")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  // Hash OTP if it's modified
  if (this.isModified("otp") && this.otp && !this.otp.startsWith("$2b$")) {
    this.otp = await bcrypt.hash(this.otp.toString(), 10);
  }
});

userSchema.methods.isPasswordCorrect = async function (inputPassword) {
  return await bcrypt.compare(inputPassword.toString(), this.password);
};

userSchema.methods.isOtpCorrect = async function (plainOtp) {
  if (!plainOtp || !this.otp) {
    return false;
  }
  return await bcrypt.compare(plainOtp.toString(), this.otp);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateOtpToken = function () {
  return jwt.sign({ _id: this._id }, process.env.OTP_TOKEN_SECRET, {
    expiresIn: process.env.OTP_TOKEN_EXPIRY,
  });
};

const User = mongoose.model('User', userSchema);

export default User;





