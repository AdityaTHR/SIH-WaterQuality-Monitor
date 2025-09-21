// models/DailyTip.js
import mongoose from "mongoose";

const dailyTipSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set tip creation date
  },
});

export default mongoose.model("DailyTip", dailyTipSchema);
