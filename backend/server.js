const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const database = require("./config/mysql-database");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const foodRoutes = require("./routes/foods");
const mealRoutes = require("./routes/meals");
const budgetRoutes = require("./routes/budget");
const groceryRoutes = require("./routes/grocery");
const childrenRoutes = require("./routes/children");

// Import admin routes
const adminAuthRoutes = require("./routes/admin-auth");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());

// Rate limiting - More permissive for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for development
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for OPTIONS requests (CORS preflight)
    return req.method === 'OPTIONS';
  }
});
app.use(limiter);

// CORS configuration - Allow all origins for development
app.use(
  cors({
    origin: true, // Allow all origins for development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    preflightContinue: false,
    optionsSuccessStatus: 200
  })
);

// Handle preflight requests explicitly
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files (for serving images, etc.)
app.use("/uploads", express.static("uploads"));

// Serve admin panel static files
app.use("/admin", express.static("../admin"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/children", childrenRoutes);

// Admin routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: "MySQL",
    port: PORT,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: err.message,
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid token",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
  });
});

// Initialize database and start server
async function startServer() {
  try {

    await database.connect();

    await database.initializeTables();

    const server = app.listen(PORT, () => {
      console.log(`📍 Port: ${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error("💡 Solutions:");
        console.error("   1. Close any existing server on this port");
        console.error("   2. Change PORT in .env file");
        console.error("   3. Kill existing node processes in Task Manager");
      } else {
        console.error("❌ Server error:", error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error("");
    console.error("========================================");
    console.error("❌ FAILED TO START SERVER");
    console.error("========================================");
    console.error("Error:", error.message);
    console.error("");

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("💡 Database Access Denied:");
      console.error("   - Check your MySQL credentials in .env file");
      console.error("   - Make sure XAMPP MySQL is running");
      console.error("   - Verify database user permissions");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("💡 Database Connection Refused:");
      console.error("   - Make sure XAMPP MySQL service is started");
      console.error("   - Check if MySQL is running on port 3306");
      console.error("   - Verify your database host configuration");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error("💡 Database Not Found:");
      console.error("   - Create 'anrs_db' database in phpMyAdmin");
      console.error("   - Go to http://localhost/phpmyadmin");
      console.error("   - Click 'New' and create database 'anrs_db'");
    }

    console.error("");
    console.error("📋 Troubleshooting checklist:");
    console.error("   ✓ XAMPP MySQL is running");
    console.error("   ✓ Database 'anrs_db' exists");
    console.error("   ✓ .env file has correct credentials");
    console.error("   ✓ Port 3002 is available");
    console.error("");

    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Graceful shutdown...");
  try {
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Graceful shutdown...");
  try {
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

startServer();
