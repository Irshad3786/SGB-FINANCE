import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const permissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      enum: ["dashboard", "vehicleStock", "users", "finance","addEntry","pendingPayments"]
    },

    actions: {
      edit: { type: Boolean, default: false },
      view: { type: Boolean, default: true },
    }
  },
  { _id: false }
);

const subAdminSchema = new mongoose.Schema(
  {
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

    phone: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
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

    roleName: {
      type: String,
      required: true, 
      enum: ["Financer", "Collection Agent", "Data Entry"]
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    role: {
      type: String,
      default: "sub-admin",
      immutable: true
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
      default: 0,
    },

    otpBlockedUntil: {
      type: Date,
      default: null,
    },

    lastOtpSentAt: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    permissions: [permissionSchema],

  },
  { timestamps: true }
);

subAdminSchema.pre("save", async function () {
  // hash password only if not already hashed
  if (this.isModified("password") && !this.password.startsWith("$2b$")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  // hash otp only if not already hashed
  if (this.isModified("otp") && this.otp && !this.otp.startsWith("$2b$")) {
    this.otp = await bcrypt.hash(this.otp.toString(), 10);
  }
});

subAdminSchema.methods.isPasswordCorrect = async function (inputPassword) {
  return await bcrypt.compare(inputPassword.toString(), this.password);
};

subAdminSchema.methods.isOtpCorrect = async function (plainOtp) {
  if (!plainOtp || !this.otp) {
    return false;
  }
  return await bcrypt.compare(plainOtp.toString(), this.otp);
};

subAdminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      roleName: this.roleName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

subAdminSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

subAdminSchema.methods.generateOtpToken = function () {
  return jwt.sign({ _id: this._id }, process.env.OTP_TOKEN_SECRET, {
    expiresIn: process.env.OTP_TOKEN_EXPIRY,
  });
};

const SubAdmin = mongoose.model("SubAdmin", subAdminSchema);
export default SubAdmin;
