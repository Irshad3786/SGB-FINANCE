import mongoose from "mongoose";

const buildApplicationNo = (doc) => {
  const createdAt = doc?.createdAt ? new Date(doc.createdAt) : new Date();
  const year = String(createdAt.getFullYear()).slice(-2);
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const day = String(createdAt.getDate()).padStart(2, "0");
  const suffix = String(doc?._id || "").slice(-6).toUpperCase();
  return `APP-${year}${month}${day}-${suffix}`;
};

const requestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: ["finance", "contact", "support", "application", "ticket", "other"],
      required: true,
      default: "other",
      index: true,
    },
    applicationNo: {
      type: String,
      trim: true,
      default: "",
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

requestSchema.pre("validate", function setApplicationNo() {
  if (!this.applicationNo) {
    this.applicationNo = buildApplicationNo(this);
  }
});

const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);

export default Request;
