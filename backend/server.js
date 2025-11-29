import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";

// Load env FIRST
dotenv.config();

const app = express();

// ✅ CORS setup (will accept Vercel frontend calls + local dev tools)
app.use(cors({
  origin: "*", // most permissive — you can tighten later
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Import routes
import authRoutes from "./routes/auth.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import uiComponentRoutes from "./routes/uiComponents.js";

// ✅ Root test
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ✅ Health check — critical for Render deployment
app.get("/api/health", (req, res) => {
  res.json({
    server: "ok",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString()
  });
});

// ✅ Component test (your main goal)
app.get("/api/components", (req, res) => {
  res.json({ message: "components api working" });
});

// ✅ Mount your real routes (now actually active)
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/ui-components", uiComponentRoutes);

// ❗ Must connect only to Atlas — no localhost fallback
const MONGO_URI = process.env.MONGO_URI;
console.log("🔗 Connecting Mongo:", MONGO_URI);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  bufferCommands: false
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB failed:", err.message));

// Connection events
mongoose.connection.on("error", err => console.log("❌ Mongo runtime:", err.message));
mongoose.connection.on("disconnected", () => console.log("⚠️ Mongo disconnected"));
mongoose.connection.on("connected", () => console.log("✅ Mongo connected"));

// ✅ Start server properly for Render (must support env port)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
