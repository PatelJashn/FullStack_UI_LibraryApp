import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";

// Load environment variables as early as possible
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Allows JSON data in requests
app.use(session({
  secret: process.env.JWT_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection with fallback for development
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/uiforge";
console.log("🔗 Attempting to connect to MongoDB...");

let mongoConnected = false;

mongoose
  .connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    ssl: false, // Disable SSL for local development
    sslValidate: false
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    mongoConnected = true;
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("💡 To fix this issue:");
    console.log("   1. Create a .env file in the backend directory");
    console.log("   2. Add your MongoDB URI: MONGO_URI=your_connection_string");
    console.log("   3. Or install MongoDB locally and run: mongod");
    console.log("   4. Or use MongoDB Atlas and whitelist your IP address");
    console.log("🔄 Starting server without database connection...");
    mongoConnected = false;
  });

import authRoutes from "./routes/auth.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import uiComponentRoutes from "./routes/uiComponents.js";

// Test route
app.get("/", (req, res) => {
  res.send("UI Forge Backend is Running...");
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "Server is running", 
    mongodb: mongoConnected ? "Connected" : "Not connected",
    timestamp: new Date().toISOString()
  });
});

// Use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/ui-components", uiComponentRoutes);

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📊 MongoDB Status: ${mongoConnected ? "Connected" : "Not connected"}`);
});
