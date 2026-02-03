import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true
    },

    email: {
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

    secretCode: {
      type: String,
      required: true,
      select: false
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


const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
