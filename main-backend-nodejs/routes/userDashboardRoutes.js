// routes/userDashboardRoutes.js
import express from "express";
import { protectUser } from "../middleware/authMiddleware.js";
import {
  getLatestReports,
  getReportById,
  downloadReport,
  shareReport,
  getAlerts,
  getDailyTips,
  submitSymptomReport
} from "../controllers/userDashboardController.js";

const router = express.Router();

// All routes are protected for normal users
router.use(protectUser);

// 📄 Latest Reports
router.get("/latest-reports", getLatestReports);

// 📜 Report Management
router.get("/report/:id", getReportById);         // View report details
router.get("/report/:id/download", downloadReport); // Download report (CSV/PDF)
router.post("/report/:id/share", shareReport);      // Share report

// ⚠️ Alerts
router.get("/alerts", getAlerts);

// 💡 Daily Tips
router.get("/daily-tips", getDailyTips);

// 🩺 Symptom Reporting
router.post("/symptom-report", submitSymptomReport);

export default router;
