import mongoose from "mongoose";

const collectionEntrySchema = new mongoose.Schema(
  {
    agentName: {
      type: String,
      required: true,
      trim: true,
    },
    agreementNo: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAdmin",
    },
  },
  { timestamps: true }
);

const CollectionEntry = mongoose.model("CollectionEntry", collectionEntrySchema);
export default CollectionEntry;
