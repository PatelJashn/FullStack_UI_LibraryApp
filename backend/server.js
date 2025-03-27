import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Load environment variables as early as possible
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON data in requests

// Validate MongoDB URI
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Test route
app.get("/", (req, res) => {
  res.send("UI Forge Backend is Running...");
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
