// models/WaterData.js
import mongoose from "mongoose";

const waterDataSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    week: {
      type: Number,
      required: true,
      min: 1,
      max: 52,
    },
    rainfall_mm: {
      type: Number,
      required: true,
    },
    pH: {
      type: Number,
      required: true,
      min: 0,
      max: 14,
    },
    turbidity_NTU: {
      type: Number,
      required: true,
    },
    ecoli_contamination: {
      type: Boolean,
      required: true,
    },
    cases: {
      type: Number,
      default: 0,
    },
    outbreak: {
      type: Boolean,
      default: false,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GovernmentUser", // Only gov users can report
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WaterData", waterDataSchema);
