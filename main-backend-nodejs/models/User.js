import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,   // one phone per user
  },
  email: {
    type: String,
    unique: true,
    sparse: true,   // optional but must be unique if provided
  },
  otp: {
    type: String,   // temporary OTP stored until verified
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
