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

  },
  { timestamps: true })

userSchema.pre("save", async function () {
  if (this.isModified("password") && !this.password.startsWith("$2b$")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.isPasswordCorrect = async function (inputPassword) {
  return await bcrypt.compare(inputPassword.toString(), this.password);
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

const User = mongoose.model('User', userSchema);

export default User;





