const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateRequest } = require("../middleware/validate");
const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email }, 
    process.env.JWT_SECRET || 'fallback-secret-1234', 
    { expiresIn: '7d' }
  );
};

// Register
router.post("/register", validateRequest(['userName', 'fullName', 'email', 'password']), async (req, res, next) => {
  try {
    const { userName, fullName, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, fullName, email, password: hashedPassword });
    const token = generateToken(user);

    res.json({ 
      success: true, 
      message: "User registered successfully", 
      token,
      user: { id: user._id, userName: user.userName, email: user.email } 
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", validateRequest(['identifier', 'password']), async (req, res, next) => {
  try {
    const { identifier, password } = req.body; 
    
    const user = await User.findOne({ 
        $or: [{ email: identifier }, { userName: identifier }] 
    });
    
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ 
        success: true,
        message: "Login successful", 
        token,
        user: { id: user._id, userName: user.userName, email: user.email } 
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
