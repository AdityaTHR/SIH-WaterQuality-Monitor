import mongoose from "mongoose";

const govUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  govId: {
    type: String,
    required: true,
    unique: true,   // each official has a unique government ID
  },
  email: {
    type: String,
    required: true,
    unique: true,   // ensure no duplicate emails
  },
  password: {
    type: String,
    required: true, // will be stored as a bcrypt hash
  },
}, { timestamps: true });

export default mongoose.model("GovernmentUser", govUserSchema);
