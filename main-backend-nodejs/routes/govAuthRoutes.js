// routes/govAuthRoutes.js
const express = require('express');
const router = express.Router();
const {
    loginGovUser,
    getGovProfile
} = require('../controllers/govAuthController');

const { protectGovUser } = require('../middleware/authMiddleware');

// @route   POST /api/gov/login
// @desc    Government user login
// @access  Public
router.post('/login', loginGovUser);

// @route   GET /api/gov/profile
// @desc    Get government user profile
// @access  Private
router.get('/profile', protectGovUser, getGovProfile);

module.exports = router;
