import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
}, {
  timestamps: true
});

// Hash password before saving (only if password is modified and not from Google OAuth)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  // Don't hash password if it's a Google OAuth user (they have googleId)
  if (this.googleId && this.password.length < 50) {
    // This is likely a Google OAuth user with a random password
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is Google OAuth user
userSchema.methods.isGoogleUser = function() {
  return !!this.googleId;
};

const User = mongoose.model("User", userSchema);

export default User;
