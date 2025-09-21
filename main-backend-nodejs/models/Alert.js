// models/Alert.js
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // e.g., "Possible cholera outbreak"
  },
  description: {
    type: String,   // Optional detailed description
  },
  district: {
    type: String,   // Optional: can target specific districts
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Alert", alertSchema);
