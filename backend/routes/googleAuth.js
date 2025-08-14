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
    // Find or create user
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        fullName: profile.displayName,
        username: profile.emails[0].value.split("@")[0],
        email: profile.emails[0].value,
        password: Math.random().toString(36), // random password, not used
        profilePic: profile.photos[0].value,
      });
      await user.save();
    } else {
      // Update profilePic if changed
      if (profile.photos && profile.photos[0] && user.profilePic !== profile.photos[0].value) {
        user.profilePic = profile.photos[0].value;
        await user.save();
      }
    }
    return done(null, user);
  } catch (err) {
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
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" })(req, res, () => {
    // Generate JWT and send user info to frontend
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    // Redirect to frontend with token and user info as query params
    const redirectUrl = `http://localhost:5173/?token=${token}&name=${encodeURIComponent(user.fullName)}&email=${encodeURIComponent(user.email)}&profilePic=${encodeURIComponent(user.profilePic || "")}`;
    res.redirect(redirectUrl);
  });
});

export default router; 