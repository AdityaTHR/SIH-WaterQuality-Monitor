// controllers/userDashboardController.js
import User from "../models/User.js";
import SymptomReport from "../models/SymptomReport.js";
import DailyTip from "../models/DailyTip.js";
import Alert from "../models/Alert.js";
import WaterData from "../models/WaterData.js";

// ---------------------------
// 👋 Personalized Greeting
// ---------------------------
export const getGreeting = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ name: user.name, profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// ⚠️ Alert System
// ---------------------------
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(5);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 📝 Report Symptoms
// ---------------------------
export const submitSymptomReport = async (req, res) => {
  try {
    const { symptoms, location } = req.body;

    if (!symptoms || !location) {
      return res.status(400).json({ error: "Symptoms and location are required" });
    }

    const newReport = new SymptomReport({
      user: req.user._id,
      symptoms,
      location,
    });

    await newReport.save();
    res.status(201).json({ message: "Symptoms reported successfully ✅", report: newReport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 💡 Tip Of The Day
// ---------------------------
export const getDailyTips = async (req, res) => {
  try {
    const tip = await DailyTip.findOne().sort({ date: -1 });
    res.json(tip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 📄 Latest Reports
// ---------------------------
export const getLatestReports = async (req, res) => {
  try {
    const waterReports = await WaterData.find().sort({ createdAt: -1 }).limit(10);
    const symptomReports = await SymptomReport.find().sort({ reportedAt: -1 }).limit(10);
    res.json({ waterReports, symptomReports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 📜 Report Management
// ---------------------------
export const getReportById = async (req, res) => {
  try {
    const report = await WaterData.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const report = await WaterData.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Convert to CSV
    const csv = `Year,District,Week,Rainfall_mm,pH,Turbidity_NTU,Ecoli_Contamination,Cases,Outbreak
${report.year},${report.district},${report.week},${report.rainfall_mm},${report.pH},${report.turbidity_NTU},${report.ecoli_contamination},${report.cases},${report.outbreak}`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=report_${report._id}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const shareReport = async (req, res) => {
  try {
    const report = await WaterData.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Example: generate a shareable link (frontend handles sharing)
    const shareableLink = `${process.env.FRONTEND_URL}/reports/${report._id}`;
    res.json({ message: "Report ready to share", link: shareableLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 🩺 Get User's Own Symptom Reports
// ---------------------------
export const getMySymptoms = async (req, res) => {
  try {
    const reports = await SymptomReport.find({ user: req.user._id }).sort({ reportedAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
