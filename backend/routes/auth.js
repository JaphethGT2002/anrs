const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const UserActivity = require("../models/UserActivity");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many authentication attempts",
    message: "Please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      type: "user",
    },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// POST /api/auth/register - User registration
router.post(
  "/register",
  authLimiter,
  validateRegistration,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Create new user with activity logging details
      const user = await User.create({
        name,
        email,
        password,
        role: "user",
      }, {
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        registration_source: 'web_api'
      });

      // Generate token
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: user.toSafeJSON(),
      });
    } catch (error) {
      console.error("User registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// POST /api/auth/login - User login
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "User account is deactivated",
      });
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user);

    // Log login activity
    try {
      await UserActivity.logLogin(user.id, {
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        login_source: 'web_api'
      });
    } catch (error) {
      console.warn('Failed to log login activity:', error);
      // Don't fail login if activity logging fails
    }

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/auth/verify - Verify user token
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        valid: false,
        message: "No token provided",
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      );

      // Check if it's a user token
      if (decoded.type !== "user") {
        return res.status(401).json({
          valid: false,
          message: "Invalid token type",
        });
      }

      // Verify user still exists and is active
      const user = await User.findById(decoded.userId);
      if (!user || !user.is_active) {
        return res.status(401).json({
          valid: false,
          message: "User not found or inactive",
        });
      }

      res.json({
        valid: true,
        user: user.toSafeJSON(),
      });
    } catch (jwtError) {
      return res.status(401).json({
        valid: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      valid: false,
      message: "Internal server error",
    });
  }
});

// GET /api/auth/profile - Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working" });
});

module.exports = router;
