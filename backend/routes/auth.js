import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
dotenv.config();

const router = express.Router();

// In-memory OTP store (for demo; use Redis or DB in production)
const otpStore = {};

// In-memory user store for local development when MongoDB is not available
const localUsers = new Map();

// Send OTP endpoint
router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ message: "Phone number required" });
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phoneNumber] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry
  // TODO: Integrate with SMS provider (e.g., Twilio) to send OTP
  console.log(`OTP for ${phoneNumber}: ${otp}`); // For demo only
  res.json({ message: "OTP sent" });
});

// Verify OTP endpoint
router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const record = otpStore[phoneNumber];
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  delete otpStore[phoneNumber]; // OTP can only be used once
  res.json({ message: "OTP verified" });
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "All fields are required: username, email, password" 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Check if user already exists by email (case insensitive)
    const existingUserByEmail = localUsers.has(email.toLowerCase()) || 
      (mongoose.connection.readyState === 1 && await User.findOne({ email: email.toLowerCase() }));
    
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username already exists
    const existingUserByUsername = Array.from(localUsers.values()).some(user => user.username === username) ||
      (mongoose.connection.readyState === 1 && await User.findOne({ username }));
    
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      fullName: username, // Use username as fullName
      username, 
      email: email.toLowerCase(), 
      password: await bcrypt.hash(password, 10), // Hash password
      profilePic: ""
    };

    // Store user locally
    localUsers.set(email.toLowerCase(), newUser);
    
    // If MongoDB is connected, also save there
    if (mongoose.connection.readyState === 1) {
      const mongoUser = new User({ 
        fullName: username,
        username, 
        email: email.toLowerCase(), 
        password 
      });
      await mongoUser.save();
    }
    
    console.log(`✅ New user registered: ${email}`);
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    let user = null;

    // Try to find user in local store first
    if (localUsers.has(email.toLowerCase())) {
      user = localUsers.get(email.toLowerCase());
    } else if (mongoose.connection.readyState === 1) {
      // If not in local store and MongoDB is connected, try there
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id || user._id,
        email: user.email,
        username: user.username 
      }, 
      process.env.JWT_SECRET || "fallback_secret", 
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${email}`);
    
    // Return user data and token
    res.json({ 
      message: "Login successful",
      user: {
        id: user.id || user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
      },
      token 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

// Get current user profile
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    
    let user = null;
    
    // Try to find user in local store first
    const localUser = Array.from(localUsers.values()).find(u => u.id === decoded.id || u.email === decoded.email);
    if (localUser) {
      user = localUser;
    } else if (mongoose.connection.readyState === 1) {
      // If not in local store and MongoDB is connected, try there
      user = await User.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
