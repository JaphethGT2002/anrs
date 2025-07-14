const express = require("express");
const { body, query, param, validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const {
  adminAuth,
  superAdminAuth,
  requireRole,
  canActOnAdmin,
  preventSelfDeactivation,
} = require("../middleware/admin-auth");
const database = require("../config/mysql-database");

const router = express.Router();

// Apply admin authentication to all routes
router.use(adminAuth);

// Helper functions for dashboard statistics
async function getUserStats() {
  try {
    const sql = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_this_month,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_last_month
      FROM users
    `;

    const result = await database.execute(sql);
    const rows =
      Array.isArray(result) && result.length > 0
        ? Array.isArray(result[0])
          ? result[0]
          : result
        : [];
    const stats = rows[0] || {};

    // Calculate percentage change
    const thisMonth = parseInt(stats.new_this_month) || 0;
    const lastMonth = parseInt(stats.new_last_month) || 0;
    const change =
      lastMonth > 0
        ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
        : 0;

    return {
      total: parseInt(stats.total) || 0,
      active: parseInt(stats.active) || 0,
      change: change,
      activeChange: 0, // Could be calculated if we track active user changes
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return { total: 0, active: 0, change: 0, activeChange: 0 };
  }
}

async function getMealStats() {
  try {
    const sql = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN saved_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_this_month,
        SUM(CASE WHEN saved_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND saved_at < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_last_month
      FROM saved_meals
    `;

    const result = await database.execute(sql);
    const rows =
      Array.isArray(result) && result.length > 0
        ? Array.isArray(result[0])
          ? result[0]
          : result
        : [];
    const stats = rows[0] || {};

    // Calculate percentage change
    const thisMonth = parseInt(stats.new_this_month) || 0;
    const lastMonth = parseInt(stats.new_last_month) || 0;
    const change =
      lastMonth > 0
        ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
        : 0;

    return {
      total: parseInt(stats.total) || 0,
      change: change,
    };
  } catch (error) {
    console.error("Error getting meal stats:", error);
    return { total: 0, change: 0 };
  }
}

async function getFoodStats() {
  try {
    const sql = `SELECT COUNT(*) as total FROM foods`;
    const result = await database.execute(sql);
    const rows =
      Array.isArray(result) && result.length > 0
        ? Array.isArray(result[0])
          ? result[0]
          : result
        : [];
    const stats = rows[0] || {};

    return {
      total: parseInt(stats.total) || 0,
    };
  } catch (error) {
    console.error("Error getting food stats:", error);
    return { total: 0 };
  }
}

// Validation middleware
const validateAdminUpdate = [
  param("id").isInt({ min: 1 }).withMessage("Invalid admin ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2 and 255 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("role")
    .optional()
    .isIn(["admin", "super_admin"])
    .withMessage("Invalid role"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),
];

const validatePasswordUpdate = [
  param("id").isInt({ min: 1 }).withMessage("Invalid admin ID"),
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

// GET /api/admin/admins - Get all admins (super admin only)
router.get(
  "/admins",
  superAdminAuth,
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("search")
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Search term too long"),
  ],
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

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || "";

      const result = await Admin.getAll(page, limit, search);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch admins",
      });
    }
  }
);

// GET /api/admin/admins/:id - Get specific admin
router.get(
  "/admins/:id",
  [param("id").isInt({ min: 1 }).withMessage("Invalid admin ID")],
  canActOnAdmin,
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

      const admin = await Admin.findById(req.params.id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      res.json({
        success: true,
        admin: admin.toJSON(),
      });
    } catch (error) {
      console.error("Error fetching admin:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch admin",
      });
    }
  }
);

// PUT /api/admin/admins/:id - Update admin
router.put(
  "/admins/:id",
  validateAdminUpdate,
  canActOnAdmin,
  preventSelfDeactivation,
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

      const admin = await Admin.findById(req.params.id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      // Check if email is being changed and if it already exists
      if (req.body.email && req.body.email !== admin.email) {
        const existingAdmin = await Admin.findByEmail(req.body.email);
        if (existingAdmin) {
          return res.status(409).json({
            success: false,
            message: "Email already exists",
          });
        }
      }

      // Only super admins can change roles
      if (req.body.role && req.admin.role !== "super_admin") {
        return res.status(403).json({
          success: false,
          message: "Only super admins can change roles",
        });
      }

      const updatedAdmin = await admin.update(req.body);

      res.json({
        success: true,
        message: "Admin updated successfully",
        admin: updatedAdmin.toJSON(),
      });
    } catch (error) {
      console.error("Error updating admin:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update admin",
      });
    }
  }
);

// PUT /api/admin/admins/:id/password - Update admin password
router.put(
  "/admins/:id/password",
  validatePasswordUpdate,
  canActOnAdmin,
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

      const admin = await Admin.findById(req.params.id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Verify current password
      const isValidPassword = await admin.verifyPassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      await admin.updatePassword(newPassword);

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update password",
      });
    }
  }
);

// PATCH /api/admin/admins/:id/toggle-status - Toggle admin status (super admin only)
router.patch(
  "/admins/:id/toggle-status",
  [param("id").isInt({ min: 1 }).withMessage("Invalid admin ID")],
  superAdminAuth,
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

      const adminId = parseInt(req.params.id);

      // Prevent self-deactivation
      if (adminId === req.admin.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot change your own status",
        });
      }

      const admin = await Admin.findById(adminId);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      const updatedAdmin = await admin.toggleStatus();

      res.json({
        success: true,
        message: `Admin ${
          updatedAdmin.is_active ? "activated" : "deactivated"
        } successfully`,
        admin: updatedAdmin.toJSON(),
      });
    } catch (error) {
      console.error("Error toggling admin status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle admin status",
      });
    }
  }
);

// DELETE /api/admin/admins/:id - Delete admin (super admin only)
router.delete(
  "/admins/:id",
  [param("id").isInt({ min: 1 }).withMessage("Invalid admin ID")],
  superAdminAuth,
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

      const adminId = parseInt(req.params.id);

      // Prevent self-deletion
      if (adminId === req.admin.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      const admin = await Admin.findById(adminId);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      await admin.delete();

      res.json({
        success: true,
        message: "Admin deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete admin",
      });
    }
  }
);

// GET /api/admin/stats - Get admin statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await Admin.getStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics",
    });
  }
});

// GET /api/admin/stats/dashboard - Get dashboard statistics
router.get("/stats/dashboard", async (req, res) => {
  try {
    // Get comprehensive dashboard statistics
    const [userStats, mealStats, foodStats] = await Promise.all([
      getUserStats(),
      getMealStats(),
      getFoodStats(),
    ]);

    const dashboardStats = {
      totalUsers: userStats.total || 0,
      activeUsers: userStats.active || 0,
      totalMeals: mealStats.total || 0,
      totalFoods: foodStats.total || 0,
      usersChange: userStats.change || 0,
      mealsChange: mealStats.change || 0,
      foodsChange: 0, // Foods are static for now
      activeUsersChange: userStats.activeChange || 0,
    };

    res.json(dashboardStats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
});

// GET /api/admin/system/health - Get system health
router.get("/system/health", async (req, res) => {
  try {
    const health = {
      database: "healthy",
      api: "healthy",
      memory: "healthy",
      disk: "healthy",
      timestamp: new Date().toISOString(),
    };

    // Test database connection
    try {
      await database.execute("SELECT 1");
    } catch (dbError) {
      health.database = "error";
    }

    // Check memory usage (basic check)
    const memUsage = process.memoryUsage();
    const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    if (memUsagePercent > 90) {
      health.memory = "warning";
    } else if (memUsagePercent > 95) {
      health.memory = "error";
    }

    res.json(health);
  } catch (error) {
    console.error("Error checking system health:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check system health",
    });
  }
});

// ===== ANALYTICS ROUTES =====

// GET /api/admin/analytics/users - Get user analytics
router.get("/analytics/users", [
  query("period")
    .optional()
    .isIn(["7d", "30d", "90d", "1y"])
    .withMessage("Invalid period"),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const period = req.query.period || "30d";

    // Convert period to days
    const periodDays = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365
    };

    const days = periodDays[period];

    // Get user registration trends
    const trendSql = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Get user activity stats
    const activitySql = `
      SELECT
        COUNT(DISTINCT user_id) as active_users,
        COUNT(*) as total_activities
      FROM user_activities
      WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `;

    const [trendResult, activityResult] = await Promise.all([
      database.execute(trendSql, [days]),
      database.execute(activitySql, [days])
    ]);

    const trends = Array.isArray(trendResult) && trendResult.length > 0
      ? Array.isArray(trendResult[0]) ? trendResult[0] : trendResult
      : [];

    const activity = Array.isArray(activityResult) && activityResult.length > 0
      ? Array.isArray(activityResult[0]) ? activityResult[0] : activityResult
      : [];

    res.json({
      success: true,
      period,
      trends: trends.map(row => ({
        date: row.date,
        newUsers: parseInt(row.new_users) || 0
      })),
      activity: {
        activeUsers: parseInt(activity[0]?.active_users) || 0,
        totalActivities: parseInt(activity[0]?.total_activities) || 0
      }
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user analytics",
    });
  }
});

// GET /api/admin/analytics/meals - Get meal analytics
router.get("/analytics/meals", [
  query("period")
    .optional()
    .isIn(["7d", "30d", "90d", "1y"])
    .withMessage("Invalid period"),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const period = req.query.period || "30d";

    // Convert period to days
    const periodDays = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365
    };

    const days = periodDays[period];

    // Get meal creation trends
    const trendSql = `
      SELECT
        DATE(saved_at) as date,
        COUNT(*) as meals_created,
        AVG(total_cost) as avg_cost
      FROM saved_meals
      WHERE saved_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(saved_at)
      ORDER BY date ASC
    `;

    // Get cost distribution
    const costSql = `
      SELECT
        CASE
          WHEN total_cost < 10 THEN 'low'
          WHEN total_cost BETWEEN 10 AND 25 THEN 'medium'
          ELSE 'high'
        END as cost_range,
        COUNT(*) as count
      FROM saved_meals
      WHERE saved_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY cost_range
    `;

    const [trendResult, costResult] = await Promise.all([
      database.execute(trendSql, [days]),
      database.execute(costSql, [days])
    ]);

    const trends = Array.isArray(trendResult) && trendResult.length > 0
      ? Array.isArray(trendResult[0]) ? trendResult[0] : trendResult
      : [];

    const costs = Array.isArray(costResult) && costResult.length > 0
      ? Array.isArray(costResult[0]) ? costResult[0] : costResult
      : [];

    res.json({
      success: true,
      period,
      trends: trends.map(row => ({
        date: row.date,
        mealsCreated: parseInt(row.meals_created) || 0,
        avgCost: parseFloat(row.avg_cost) || 0
      })),
      costDistribution: costs.reduce((acc, row) => {
        acc[row.cost_range] = parseInt(row.count) || 0;
        return acc;
      }, { low: 0, medium: 0, high: 0 })
    });
  } catch (error) {
    console.error("Error fetching meal analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meal analytics",
    });
  }
});

// GET /api/admin/users - Get users with pagination
router.get(
  "/users",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("search")
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Search term too long"),
  ],
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

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || "";
      const offset = (page - 1) * limit;

      let sql = `
      SELECT id, name, email, role, is_active, created_at, updated_at
      FROM users
    `;
      let countSql = `SELECT COUNT(*) as total FROM users`;
      const params = [];

      if (search) {
        sql += ` WHERE name LIKE ? OR email LIKE ?`;
        countSql += ` WHERE name LIKE ? OR email LIKE ?`;
        params.push(`%${search}%`, `%${search}%`);
      }

      sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [usersResult, countResult] = await Promise.all([
        database.execute(sql, params),
        database.execute(
          countSql,
          search ? [`%${search}%`, `%${search}%`] : []
        ),
      ]);

      const users =
        Array.isArray(usersResult) && usersResult.length > 0
          ? Array.isArray(usersResult[0])
            ? usersResult[0]
            : usersResult
          : [];

      const countRows =
        Array.isArray(countResult) && countResult.length > 0
          ? Array.isArray(countResult[0])
            ? countResult[0]
            : countResult
          : [];

      const total = countRows[0]?.total || 0;

      res.json({
        success: true,
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }
);

// GET /api/admin/users/:id - Get specific user
router.get(
  "/users/:id",
  [param("id").isInt({ min: 1 }).withMessage("Invalid user ID")],
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

      const userId = parseInt(req.params.id);
      const sql = `
        SELECT id, name, email, role, is_active, created_at, updated_at
        FROM users
        WHERE id = ?
      `;

      const result = await database.execute(sql, [userId]);
      const users =
        Array.isArray(result) && result.length > 0
          ? Array.isArray(result[0])
            ? result[0]
            : result
          : [];

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user: users[0],
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  }
);

// PUT /api/admin/users/:id - Update user
router.put(
  "/users/:id",
  [
    param("id").isInt({ min: 1 }).withMessage("Invalid user ID"),
    body("name")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Role must be either 'user' or 'admin'"),
    body("is_active")
      .optional()
      .isBoolean()
      .withMessage("is_active must be a boolean"),
  ],
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

      const userId = parseInt(req.params.id);
      const { name, email, role, is_active } = req.body;

      // Check if user exists
      const checkSql = "SELECT id, email FROM users WHERE id = ?";
      const checkResult = await database.execute(checkSql, [userId]);
      const existingUsers =
        Array.isArray(checkResult) && checkResult.length > 0
          ? Array.isArray(checkResult[0])
            ? checkResult[0]
            : checkResult
          : [];

      if (existingUsers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if email is being changed and if it already exists
      if (email && email !== existingUsers[0].email) {
        const emailCheckSql =
          "SELECT id FROM users WHERE email = ? AND id != ?";
        const emailResult = await database.execute(emailCheckSql, [
          email,
          userId,
        ]);
        const emailUsers =
          Array.isArray(emailResult) && emailResult.length > 0
            ? Array.isArray(emailResult[0])
              ? emailResult[0]
              : emailResult
            : [];

        if (emailUsers.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Email already exists",
          });
        }
      }

      // Update user
      const updateSql = `
        UPDATE users
        SET name = ?, email = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await database.execute(updateSql, [
        name,
        email,
        role || "user",
        is_active !== undefined ? is_active : true,
        userId,
      ]);

      // Get updated user
      const updatedResult = await database.execute(
        "SELECT id, name, email, role, is_active, created_at, updated_at FROM users WHERE id = ?",
        [userId]
      );
      const updatedUsers =
        Array.isArray(updatedResult) && updatedResult.length > 0
          ? Array.isArray(updatedResult[0])
            ? updatedResult[0]
            : updatedResult
          : [];

      res.json({
        success: true,
        message: "User updated successfully",
        user: updatedUsers[0],
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }
  }
);

// DELETE /api/admin/users/:id - Delete user
router.delete(
  "/users/:id",
  [param("id").isInt({ min: 1 }).withMessage("Invalid user ID")],
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

      const userId = parseInt(req.params.id);

      // Check if user exists
      const checkSql = "SELECT id, name FROM users WHERE id = ?";
      const checkResult = await database.execute(checkSql, [userId]);
      const existingUsers =
        Array.isArray(checkResult) && checkResult.length > 0
          ? Array.isArray(checkResult[0])
            ? checkResult[0]
            : checkResult
          : [];

      if (existingUsers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete user (this will cascade delete related records due to foreign key constraints)
      const deleteSql = "DELETE FROM users WHERE id = ?";
      await database.execute(deleteSql, [userId]);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  }
);

// PATCH /api/admin/users/:id/toggle-status - Toggle user active status
router.patch(
  "/users/:id/toggle-status",
  [param("id").isInt({ min: 1 }).withMessage("Invalid user ID")],
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

      const userId = parseInt(req.params.id);

      // Check if user exists and get current status
      const checkSql = "SELECT id, name, is_active FROM users WHERE id = ?";
      const checkResult = await database.execute(checkSql, [userId]);
      const existingUsers =
        Array.isArray(checkResult) && checkResult.length > 0
          ? Array.isArray(checkResult[0])
            ? checkResult[0]
            : checkResult
          : [];

      if (existingUsers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const currentStatus = existingUsers[0].is_active;
      const newStatus = !currentStatus;

      // Update user status
      const updateSql = `
        UPDATE users
        SET is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await database.execute(updateSql, [newStatus, userId]);

      res.json({
        success: true,
        message: `User ${newStatus ? "activated" : "deactivated"} successfully`,
        user: {
          id: userId,
          name: existingUsers[0].name,
          is_active: newStatus,
        },
      });
    } catch (error) {
      console.error("Error toggling user status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle user status",
      });
    }
  }
);

// ===== FOOD MANAGEMENT ROUTES =====

// GET /api/admin/foods - Get foods with pagination
router.get(
  "/foods",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("search")
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Search term too long"),
    query("category")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Category too long"),
  ],
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

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || "";
      const category = req.query.category || "";
      const offset = (page - 1) * limit;

      let sql = `
        SELECT id, name_en, name_rw, category, price, price_unit, benefits, quantity_units
        FROM foods
      `;
      let countSql = `SELECT COUNT(*) as total FROM foods`;
      const params = [];

      // Build WHERE clause
      const conditions = [];
      if (search) {
        conditions.push(`(name_en LIKE ? OR name_rw LIKE ?)`);
        params.push(`%${search}%`, `%${search}%`);
      }
      if (category) {
        conditions.push(`category = ?`);
        params.push(category);
      }

      if (conditions.length > 0) {
        const whereClause = ` WHERE ${conditions.join(" AND ")}`;
        sql += whereClause;
        countSql += whereClause;
      }

      sql += ` ORDER BY name_en ASC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [foodsResult, countResult] = await Promise.all([
        database.execute(sql, params),
        database.execute(
          countSql,
          search || category ? params.slice(0, -2) : []
        ),
      ]);

      const foods =
        Array.isArray(foodsResult) && foodsResult.length > 0
          ? Array.isArray(foodsResult[0])
            ? foodsResult[0]
            : foodsResult
          : [];

      const countRows =
        Array.isArray(countResult) && countResult.length > 0
          ? Array.isArray(countResult[0])
            ? countResult[0]
            : countResult
          : [];

      const total = countRows[0]?.total || 0;

      // Transform foods data
      const transformedFoods = foods.map(food => ({
        id: food.id,
        name: {
          en: food.name_en,
          rw: food.name_rw
        },
        category: food.category,
        price: parseFloat(food.price),
        priceUnit: food.price_unit,
        benefits: JSON.parse(food.benefits || '[]'),
        quantityUnits: JSON.parse(food.quantity_units || '[]')
      }));

      res.json({
        success: true,
        foods: transformedFoods,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching foods:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch foods",
      });
    }
  }
);

// POST /api/admin/foods - Create new food
router.post(
  "/foods",
  [
    body("name_en")
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("English name is required and must be less than 255 characters"),
    body("name_rw")
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("Kinyarwanda name is required and must be less than 255 characters"),
    body("category")
      .isIn(["carbohydrates", "proteins", "vitamins", "fats"])
      .withMessage("Invalid category"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("price_unit")
      .isIn(["kg", "liter", "piece", "bunch"])
      .withMessage("Invalid price unit"),
    body("benefits")
      .optional()
      .isArray()
      .withMessage("Benefits must be an array"),
    body("quantity_units")
      .optional()
      .isArray()
      .withMessage("Quantity units must be an array"),
  ],
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

      const {
        name_en,
        name_rw,
        category,
        price,
        price_unit,
        benefits = [],
        quantity_units = []
      } = req.body;

      const sql = `
        INSERT INTO foods (name_en, name_rw, category, price, price_unit, benefits, quantity_units)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await database.execute(sql, [
        name_en,
        name_rw,
        category,
        price,
        price_unit,
        JSON.stringify(benefits),
        JSON.stringify(quantity_units)
      ]);

      const insertId = result.insertId || (Array.isArray(result) && result[0] ? result[0].insertId : null);

      res.status(201).json({
        success: true,
        message: "Food created successfully",
        food: {
          id: insertId,
          name: { en: name_en, rw: name_rw },
          category,
          price: parseFloat(price),
          priceUnit: price_unit,
          benefits,
          quantityUnits: quantity_units
        }
      });
    } catch (error) {
      console.error("Error creating food:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create food",
      });
    }
  }
);

// PUT /api/admin/foods/:id - Update food
router.put(
  "/foods/:id",
  [
    param("id").isInt({ min: 1 }).withMessage("Invalid food ID"),
    body("name_en")
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("English name is required and must be less than 255 characters"),
    body("name_rw")
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("Kinyarwanda name is required and must be less than 255 characters"),
    body("category")
      .isIn(["carbohydrates", "proteins", "vitamins", "fats"])
      .withMessage("Invalid category"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("price_unit")
      .isIn(["kg", "liter", "piece", "bunch"])
      .withMessage("Invalid price unit"),
    body("benefits")
      .optional()
      .isArray()
      .withMessage("Benefits must be an array"),
    body("quantity_units")
      .optional()
      .isArray()
      .withMessage("Quantity units must be an array"),
  ],
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

      const foodId = parseInt(req.params.id);
      const {
        name_en,
        name_rw,
        category,
        price,
        price_unit,
        benefits = [],
        quantity_units = []
      } = req.body;

      // Check if food exists
      const checkSql = `SELECT id FROM foods WHERE id = ?`;
      const existingFood = await database.execute(checkSql, [foodId]);

      if (!existingFood || existingFood.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Food not found",
        });
      }

      const sql = `
        UPDATE foods
        SET name_en = ?, name_rw = ?, category = ?, price = ?, price_unit = ?,
            benefits = ?, quantity_units = ?
        WHERE id = ?
      `;

      await database.execute(sql, [
        name_en,
        name_rw,
        category,
        price,
        price_unit,
        JSON.stringify(benefits),
        JSON.stringify(quantity_units),
        foodId
      ]);

      res.json({
        success: true,
        message: "Food updated successfully",
        food: {
          id: foodId,
          name: { en: name_en, rw: name_rw },
          category,
          price: parseFloat(price),
          priceUnit: price_unit,
          benefits,
          quantityUnits: quantity_units
        }
      });
    } catch (error) {
      console.error("Error updating food:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update food",
      });
    }
  }
);

// DELETE /api/admin/foods/:id - Delete food
router.delete(
  "/foods/:id",
  [param("id").isInt({ min: 1 }).withMessage("Invalid food ID")],
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

      const foodId = parseInt(req.params.id);

      // Check if food exists
      const checkSql = `SELECT id, name_en FROM foods WHERE id = ?`;
      const existingFood = await database.execute(checkSql, [foodId]);

      if (!existingFood || existingFood.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Food not found",
        });
      }

      const sql = `DELETE FROM foods WHERE id = ?`;
      await database.execute(sql, [foodId]);

      res.json({
        success: true,
        message: "Food deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting food:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete food",
      });
    }
  }
);

// GET /api/admin/meals - Get meals with pagination
router.get(
  "/meals",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("search")
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Search term too long"),
  ],
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

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || "";
      const offset = (page - 1) * limit;

      let sql = `
        SELECT sm.id, sm.name, sm.total_cost, sm.saved_at, u.name as user_name, u.email as user_email
        FROM saved_meals sm
        LEFT JOIN users u ON sm.user_id = u.id
      `;
      let countSql = `SELECT COUNT(*) as total FROM saved_meals sm`;
      const params = [];

      if (search) {
        sql += ` WHERE sm.name LIKE ? OR u.name LIKE ? OR u.email LIKE ?`;
        countSql += ` LEFT JOIN users u ON sm.user_id = u.id WHERE sm.name LIKE ? OR u.name LIKE ? OR u.email LIKE ?`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      sql += ` ORDER BY sm.saved_at DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [mealsResult, countResult] = await Promise.all([
        database.execute(sql, params),
        database.execute(
          countSql,
          search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []
        ),
      ]);

      const meals =
        Array.isArray(mealsResult) && mealsResult.length > 0
          ? Array.isArray(mealsResult[0])
            ? mealsResult[0]
            : mealsResult
          : [];

      const countRows =
        Array.isArray(countResult) && countResult.length > 0
          ? Array.isArray(countResult[0])
            ? countResult[0]
            : countResult
          : [];

      const total = countRows[0]?.total || 0;

      res.json({
        success: true,
        meals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching meals:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch meals",
      });
    }
  }
);

// DELETE /api/admin/meals/:id - Delete meal
router.delete(
  "/meals/:id",
  [param("id").isInt({ min: 1 }).withMessage("Invalid meal ID")],
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

      const mealId = parseInt(req.params.id);

      // Check if meal exists
      const checkSql = `SELECT id, name FROM saved_meals WHERE id = ?`;
      const existingMeal = await database.execute(checkSql, [mealId]);

      if (!existingMeal || existingMeal.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Meal not found",
        });
      }

      const sql = `DELETE FROM saved_meals WHERE id = ?`;
      await database.execute(sql, [mealId]);

      res.json({
        success: true,
        message: "Meal deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting meal:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete meal",
      });
    }
  }
);

// ===== EXPORT ROUTES =====

// GET /api/admin/export/users - Export users data
router.get("/export/users", async (req, res) => {
  try {
    const format = req.query.format || "csv";

    if (format !== "csv") {
      return res.status(400).json({
        success: false,
        message: "Only CSV format is supported"
      });
    }

    // Get all users data
    const sql = `
      SELECT id, name, email, role, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;

    const result = await database.execute(sql);
    const users = Array.isArray(result) && result.length > 0
      ? Array.isArray(result[0])
        ? result[0]
        : result
      : [];

    // Generate CSV content
    const csvHeaders = "ID,Name,Email,Role,Status,Created Date,Updated Date\n";
    const csvRows = users.map(user => {
      const createdDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A";
      const updatedDate = user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "N/A";
      const status = user.is_active ? "Active" : "Inactive";

      return `${user.id},"${user.name}","${user.email}","${user.role || 'user'}","${status}","${createdDate}","${updatedDate}"`;
    }).join("\n");

    const csvContent = csvHeaders + csvRows;

    // Set response headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.csv"`);
    res.setHeader("Content-Length", Buffer.byteLength(csvContent));

    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export users"
    });
  }
});

// GET /api/admin/export/meals - Export meals data
router.get("/export/meals", async (req, res) => {
  try {
    const format = req.query.format || "csv";

    if (format !== "csv") {
      return res.status(400).json({
        success: false,
        message: "Only CSV format is supported"
      });
    }

    // Get all meals data with user information
    const sql = `
      SELECT
        sm.id,
        sm.name,
        sm.total_cost,
        sm.foods_data,
        sm.saved_at,
        u.name as user_name,
        u.email as user_email
      FROM saved_meals sm
      LEFT JOIN users u ON sm.user_id = u.id
      ORDER BY sm.saved_at DESC
    `;

    const result = await database.execute(sql);
    const meals = Array.isArray(result) && result.length > 0
      ? Array.isArray(result[0])
        ? result[0]
        : result
      : [];

    // Generate CSV content
    const csvHeaders = "ID,Meal Name,Total Cost,User Name,User Email,Foods Count,Saved Date\n";
    const csvRows = meals.map(meal => {
      const savedDate = meal.saved_at ? new Date(meal.saved_at).toLocaleDateString() : "N/A";
      let foodsCount = 0;

      try {
        const foods = typeof meal.foods_data === 'string' ? JSON.parse(meal.foods_data) : meal.foods_data;
        foodsCount = Array.isArray(foods) ? foods.length : 0;
      } catch (e) {
        foodsCount = 0;
      }

      return `${meal.id},"${meal.name}",${meal.total_cost},"${meal.user_name || 'N/A'}","${meal.user_email || 'N/A'}",${foodsCount},"${savedDate}"`;
    }).join("\n");

    const csvContent = csvHeaders + csvRows;

    // Set response headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="meals_export_${new Date().toISOString().split('T')[0]}.csv"`);
    res.setHeader("Content-Length", Buffer.byteLength(csvContent));

    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting meals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export meals"
    });
  }
});

// GET /api/admin/export/foods - Export foods data
router.get("/export/foods", async (req, res) => {
  try {
    const format = req.query.format || "csv";

    if (format !== "csv") {
      return res.status(400).json({
        success: false,
        message: "Only CSV format is supported"
      });
    }

    // Get all foods data
    const sql = `
      SELECT id, name_en, name_rw, category, price, price_unit, benefits, quantity_units
      FROM foods
      ORDER BY category, name_en
    `;

    const result = await database.execute(sql);
    const foods = Array.isArray(result) && result.length > 0
      ? Array.isArray(result[0])
        ? result[0]
        : result
      : [];

    // Generate CSV content
    const csvHeaders = "ID,Name (English),Name (Kinyarwanda),Category,Price,Price Unit,Benefits,Image,Quantity Units\n";
    const csvRows = foods.map(food => {
      const benefits = food.benefits ? JSON.parse(food.benefits).join('; ') : '';
      const quantityUnits = food.quantity_units ? JSON.parse(food.quantity_units).join('; ') : '';

      return `${food.id},"${food.name_en}","${food.name_rw}","${food.category}",${food.price},"${food.price_unit}","${benefits}","${food.image || ''}","${quantityUnits}"`;
    }).join("\n");

    const csvContent = csvHeaders + csvRows;

    // Set response headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="foods_export_${new Date().toISOString().split('T')[0]}.csv"`);
    res.setHeader("Content-Length", Buffer.byteLength(csvContent));

    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting foods:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export foods"
    });
  }
});

module.exports = router;
