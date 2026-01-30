import mongoose from "mongoose";

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
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      select: false
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

    permissions: [permissionSchema],

  },
  { timestamps: true }
);

const SubAdmin = mongoose.model("SubAdmin", subAdminSchema);
export default SubAdmin;
