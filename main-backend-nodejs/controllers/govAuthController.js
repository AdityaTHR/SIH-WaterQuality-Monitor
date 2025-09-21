// controllers/govAuthController.js
import GovernmentUser from "../models/GovernmentUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🟢 Register Government User (only for setup / seeding)
export const registerGovUser = async (req, res) => {
  try {
    const { name, govId, email, password } = req.body;

    // check if govId or email already exists
    const existing = await GovernmentUser.findOne({ $or: [{ govId }, { email }] });
    if (existing) {
      return res.status(400).json({ error: "User with this govId or email already exists" });
    }

    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const govUser = new GovernmentUser({
      name,
      govId,
      email,
      password: hashedPassword,
    });

    await govUser.save();
    res.status(201).json({ message: "✅ Government user registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔵 Login Government User
export const govLogin = async (req, res) => {
  try {
    const { govId, password } = req.body;

    // find user
    const govUser = await GovernmentUser.findOne({ govId });
    if (!govUser) {
      return res.status(404).json({ error: "Government user not found" });
    }

    // check password
    const valid = await bcrypt.compare(password, govUser.password);
    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // create JWT
    const token = jwt.sign(
      { id: govUser._id, role: "government" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "✅ Login successful",
      token,
      role: "government",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟣 Get Government User Profile (Protected)
export const getGovProfile = async (req, res) => {
  try {
    // `req.govUser` is attached by protectGovUser middleware
    if (!req.govUser) {
      return res.status(404).json({ error: "Government user not found" });
    }

    res.json({
      id: req.govUser._id,
      name: req.govUser.name,
      govId: req.govUser.govId,
      email: req.govUser.email,
      role: "government",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
