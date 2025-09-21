// routes/waterDataRoutes.js
import express from "express";
import {
  addWaterData,
  getAllWaterData,
  getWaterDataByFilter,
  getWaterDataById,
} from "../controllers/waterDataController.js";
import { protectGovUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Add new water data (GOV users only)
router.post("/add", protectGovUser, addWaterData);

// 🔵 Get all water data (public / AI access)
router.get("/", getAllWaterData);

// 🟣 Filter water data by district & week
// Example: /api/waterdata/filter?district=Bhubaneswar&week=12
router.get("/filter", getWaterDataByFilter);

// 🟠 Get single water data entry by ID
router.get("/:id", getWaterDataById);

export default router;
