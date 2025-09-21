// controllers/userAuthController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ---------------------------
// 🟢 Request OTP (for login / register)
// ---------------------------
export const requestOtp = async (req, res) => {
  try {
    const { phone, name, email } = req.body;

    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, name, email, otp });
    } else {
      user.otp = otp; // Update OTP
    }

    await user.save();

    // TODO: send OTP via SMS using a service like Twilio
    console.log(`OTP for ${phone}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 🔵 Verify OTP & login
// ---------------------------
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // Clear OTP after verification
    user.otp = null;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, phone: user.phone, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 📜 Get user profile (protected)
// ---------------------------
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-otp");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
