// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.js";
import GovernmentUser from "./models/GovernmentUser.js";
import WaterData from "./models/WaterData.js";
import SymptomReport from "./models/SymptomReport.js";
import Alert from "./models/Alert.js";
import DailyTip from "./models/DailyTip.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");

    // Ensure collections exist by creating dummy documents (if empty)
    const collections = [
      { model: User, name: "users" },
      { model: GovernmentUser, name: "governmentusers" },
      { model: WaterData, name: "waterdatas" },
      { model: SymptomReport, name: "symptomreports" },
      { model: Alert, name: "alerts" },
      { model: DailyTip, name: "dailytips" },
    ];

    for (const col of collections) {
      const count = await col.model.estimatedDocumentCount();
      if (count === 0) {
        await col.model.create({});
        await col.model.deleteMany({}); // clean up dummy doc
        console.log(`🟢 Collection '${col.name}' initialized`);
      }
    }

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop server if DB fails
  }
};

export default connectDB;
