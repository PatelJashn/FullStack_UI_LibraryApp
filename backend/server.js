import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";

// Load environment variables FIRST
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://uiforge.vercel.app",
      "https://fullstack-ui-libraryapp.vercel.app",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    name: "uiforge-session",
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Import routes
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
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Not connected",
    mongoUri: process.env.MONGO_URI ? "Set" : "Not set",
    time: new Date().toISOString(),
  });
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/ui-components", uiComponentRoutes);

// ❗ Only connect to Atlas, no localhost fallback
const mongoUri = process.env.MONGO_URI;
console.log("🔗 Connecting to:", mongoUri);

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  })
  .then(() => console.log("✅ Connected to Atlas via", "Mongoose"))
  .catch((err) => console.log("❌ Mongo connection failed:", err.message));

// Mongo connection events
mongoose.connection.on("error", (err) => {
  console.log("❌ Mongo runtime error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongo disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("✅ Mongo connected");
});

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
});
