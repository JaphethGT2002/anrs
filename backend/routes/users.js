const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const database = require("../config/mysql-database");

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// Validation rules
const validateProfileUpdate = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
];

const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

// GET /api/users/profile - Get current user profile
router.get("/profile", async (req, res) => {
  try {
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
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/users/profile - Update user profile
router.put("/profile", validateProfileUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== user.id) {
        return res.status(409).json({
          success: false,
          message: "Email is already taken by another user",
        });
      }
    }

    // Update user profile
    await user.updateProfile({ name, email });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/users/password - Change user password
router.put("/password", validatePasswordChange, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isValidPassword = await user.verifyPassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    await user.updatePassword(newPassword);

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/users/activities - Get user activities
router.get("/activities", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const sql = `
      SELECT * FROM user_activities
      WHERE user_id = ?
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const activities = await database.all(sql, [
      req.user.id,
      parseInt(limit),
      offset,
    ]);

    // Get total count
    const countSql =
      "SELECT COUNT(*) as total FROM user_activities WHERE user_id = ?";
    const countResult = await database.get(countSql, [req.user.id]);

    res.json({
      success: true,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error("Get user activities error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/users/stats - Get user statistics
router.get("/stats", async (req, res) => {
  try {
    const userId = req.user.id;

    // Get various user statistics
    const stats = await Promise.all([
      // Saved meals count
      database.get(
        "SELECT COUNT(*) as count FROM saved_meals WHERE user_id = ?",
        [userId]
      ),
      // Budget history count
      database.get(
        "SELECT COUNT(*) as count FROM budget_history WHERE user_id = ?",
        [userId]
      ),
      // Grocery history count
      database.get(
        "SELECT COUNT(*) as count FROM grocery_history WHERE user_id = ?",
        [userId]
      ),
      // Children recommendations count
      database.get(
        "SELECT COUNT(*) as count FROM children_recommendations WHERE user_id = ?",
        [userId]
      ),
      // Recent activities count (last 30 days)
      database.get(
        `
        SELECT COUNT(*) as count FROM user_activities
        WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `,
        [userId]
      ),
    ]);

    res.json({
      success: true,
      stats: {
        savedMeals: stats[0].count,
        budgetHistory: stats[1].count,
        groceryHistory: stats[2].count,
        childrenRecommendations: stats[3].count,
        recentActivities: stats[4].count,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /api/users/account - Delete user account
router.delete("/account", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Delete user (this will cascade delete related records due to foreign key constraints)
    await user.delete();

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user account error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Users routes working", user: req.user });
});

module.exports = router;
