import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import Routes
import userAuthRoutes from "./routes/userAuthRoutes.js";
import govAuthRoutes from "./routes/govAuthRoutes.js";
import waterDataRoutes from "./routes/waterDataRoutes.js";
import userDashboardRoutes from "./routes/userDashboardRoutes.js";

// Middleware
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import connectDB from "./db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Base route
app.get("/", (req, res) => {
  res.send("🚀 JaiAarogya Rakshakah Backend Running");
});

// Routes
app.use("/api/user", userAuthRoutes);           // Normal user OTP login
app.use("/api/government", govAuthRoutes);     // Government login
app.use("/api/waterdata", waterDataRoutes);    // Water quality & outbreak data
app.use("/api/user-dashboard", userDashboardRoutes); // User dashboard routes

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});

connectDB();
