// routes/userAuthRoutes.js
import express from "express";
import { requestOtp, verifyOtp, getUserProfile } from "../controllers/userAuthController.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/user/request-otp
// @desc    Request OTP to login or register
// @access  Public
router.post("/request-otp", requestOtp);

// @route   POST /api/user/verify-otp
// @desc    Verify OTP and login
// @access  Public
router.post("/verify-otp", verifyOtp);

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protectUser, getUserProfile);

export default router;
