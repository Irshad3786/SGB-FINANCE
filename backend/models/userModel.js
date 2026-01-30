import mongoose from "mongoose";

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

const User = mongoose.model('User', userSchema);

export default User;





