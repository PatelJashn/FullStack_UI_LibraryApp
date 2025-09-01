import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
dotenv.config();

const router = express.Router();

// Only initialize Google Strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5002/api/auth/google/callback",
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("🔍 Google OAuth profile received:", {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        photos: profile.photos?.length
      });

      // Find or create user
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        // Create new user
        user = new User({
          fullName: profile.displayName,
          username: profile.emails[0].value.split("@")[0],
          email: profile.emails[0].value,
          password: Math.random().toString(36) + Date.now().toString(36), // random password
          profilePic: profile.photos?.[0]?.value || "",
          googleId: profile.id, // Store Google ID for future reference
        });
        await user.save();
        console.log("✅ New user created via Google OAuth:", user.email);
      } else {
        // Update existing user's Google info
        if (profile.photos && profile.photos[0] && user.profilePic !== profile.photos[0].value) {
          user.profilePic = profile.photos[0].value;
        }
        if (!user.googleId) {
          user.googleId = profile.id;
        }
        await user.save();
        console.log("✅ Existing user updated via Google OAuth:", user.email);
      }
      
      return done(null, user);
    } catch (err) {
      console.error("❌ Google OAuth error:", err);
      return done(err, null);
    }
  }));
} else {
  console.log("⚠️ Google OAuth credentials not found. Google login will be disabled.");
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth login route
router.get("/google", (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(400).json({ message: "Google OAuth is not configured" });
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
});

// Google OAuth callback route
router.get("/google/callback", (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(400).json({ message: "Google OAuth is not configured" });
  }
  
  passport.authenticate("google", { failureRedirect: "/login" })(req, res, () => {
    try {
      const user = req.user;
      if (!user) {
        console.error("❌ No user found in Google OAuth callback");
        return res.redirect("/login?error=authentication_failed");
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id,
          email: user.email,
          fullName: user.fullName
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
      );

      // Determine frontend URL based on environment
      const frontendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://uiforge.vercel.app' 
        : 'http://localhost:5173';

      // Redirect to frontend with token and user info
      const redirectUrl = `${frontendUrl}/auth-callback?token=${encodeURIComponent(token)}&name=${encodeURIComponent(user.fullName)}&email=${encodeURIComponent(user.email)}&profilePic=${encodeURIComponent(user.profilePic || "")}&userId=${user._id}`;
      
      console.log("✅ Google OAuth successful, redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("❌ Error in Google OAuth callback:", error);
      res.redirect("/login?error=token_generation_failed");
    }
  });
});

// Route to handle Google OAuth status check
router.get("/google/status", (req, res) => {
  const isConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  res.json({ 
    configured: isConfigured,
    clientId: isConfigured ? "configured" : "not_configured"
  });
});

export default router; 