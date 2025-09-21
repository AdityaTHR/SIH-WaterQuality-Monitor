// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import GovernmentUser from "../models/GovernmentUser.js";

// ---------------------------
// 🟢 Protect Normal User Routes (OTP-based)
// ---------------------------
export const protectUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract JWT token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object, exclude OTP
      req.user = await User.findById(decoded.id).select("-otp");

      if (!req.user) {
        return res.status(401).json({ error: "Not authorized, user not found" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

// ---------------------------
// 🔵 Protect Government User Routes
// ---------------------------
export const protectGovUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract JWT token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach government user to request object, exclude password
      req.user = await GovernmentUser.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ error: "Not authorized, government user not found" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
};
