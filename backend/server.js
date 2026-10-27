
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to EchoVault API",
    status: "running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "EchoVault backend is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("MongoDB Atlas connected successfully");
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      // Don't exit process so server remains available for health checks
    }
  } else {
    console.log("MongoDB URI not configured yet");
  }

  app.listen(PORT, () => {
    console.log(`EchoVault API running on port ${PORT}`);
  });
}

startServer();
