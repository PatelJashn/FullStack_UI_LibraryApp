// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";

// Load environment variables early
dotenv.config();

const app = express();

// Middleware
app.use(cors({ 
  origin: [
    "http://localhost:5173", 
    "https://your-vercel-app-name.vercel.app", // Replace with your actual Vercel domain
    "https://your-vercel-app-name-git-main-your-username.vercel.app" // Replace with your actual Vercel preview domain
  ], 
  credentials: true 
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
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
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Not connected",
    timestamp: new Date().toISOString(),
  });
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/ui-components", uiComponentRoutes);

// MongoDB Connection and Server Start
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/uiforge";
console.log("🔗 Attempting to connect to MongoDB...");

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // fail fast if not reachable
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    
    // Start server after MongoDB connection
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log("📊 MongoDB Status: Connected");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("💡 To fix this issue:");
    console.log("   1. Check your MONGO_URI in .env");
    console.log("   2. Make sure your IP is whitelisted in MongoDB Atlas");
    console.log("   3. Or run local MongoDB with: mongod");
    console.log("🔄 Starting server without database connection...");
    
    // Start server even if MongoDB fails
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log("📊 MongoDB Status: Not connected");
    });
  });
