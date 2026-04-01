import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: ["finance", "contact", "support", "application", "documentation", "ticket", "other"],
      required: true,
      default: "other",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "open", "approved", "rejected", "resolved"],
      default: "pending",
      index: true,
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      index: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    vehicleNumber: {
      type: String,
      trim: true,
      default: "",
    },
    chassisNumber: {
      type: String,
      trim: true,
      default: "",
    },
    vehicleName: {
      type: String,
      trim: true,
      default: "",
    },
    vehicleManufactureYear: {
      type: Number,
      default: null,
    },
    requestedAmount: {
      type: Number,
      default: 0,
    },
    purpose: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    comments: {
      type: String,
      trim: true,
      default: "",
    },
    adminNotes: {
      type: String,
      trim: true,
      default: "",
    },
    extraData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

requestSchema.index({ createdAt: -1 });

const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);

export default Request;
