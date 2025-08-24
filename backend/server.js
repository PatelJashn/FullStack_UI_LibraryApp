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
    "https://uiforge.vercel.app", // Your Vercel domain
    "https://uiforge-git-main-pateljashn.vercel.app", // Your Vercel preview domain
    "https://fullstack-ui-libraryapp.vercel.app", // Alternative Vercel domain
    process.env.FRONTEND_URL // Allow environment variable override
  ].filter(Boolean), 
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
console.log("📝 MongoDB URI:", mongoUri ? "Set" : "Not set");

// Start server first, then connect to MongoDB
const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

// Connect to MongoDB with better error handling
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // increased timeout
    socketTimeoutMS: 45000,
    bufferCommands: false,
    bufferMaxEntries: 0,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log("📊 MongoDB Status: Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("🔍 Error Details:", err);
    console.log("💡 To fix this issue:");
    console.log("   1. Check your MONGO_URI in Render environment variables");
    console.log("   2. Make sure your IP is whitelisted in MongoDB Atlas (or use 0.0.0.0/0)");
    console.log("   3. Verify your MongoDB Atlas cluster is running");
    console.log("   4. Check if your database user has the correct permissions");
    console.log("📊 MongoDB Status: Not connected - Server will continue without database");
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB reconnected');
});
