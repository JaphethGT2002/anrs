const mysql = require("mysql2/promise");
require("dotenv").config();

class Database {
  constructor() {
    this.connection = null;
    this.pool = null;
  }

  async connect() {
    try {
      // Create connection pool for better performance
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "anrs_db",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
      });

      // Test the connection
      const connection = await this.pool.getConnection();
      console.log("Connected to MySQL database");
      connection.release();

      // Initialize tables
      await this.initializeTables();

      return this.pool;
    } catch (error) {
      console.error("Error connecting to MySQL database:", error.message);
      throw error;
    }
  }

  async initializeTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS foods (
        id INT PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_rw VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        price_unit VARCHAR(50) NOT NULL,
        benefits JSON,
        quantity_units JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS food_categories (
        id VARCHAR(50) PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_rw VARCHAR(255) NOT NULL,
        icon VARCHAR(100),
        color VARCHAR(20),
        description TEXT
      )`,

      `CREATE TABLE IF NOT EXISTS saved_meals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        total_cost DECIMAL(10,2),
        foods_data JSON,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS budget_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        budget DECIMAL(10,2) NOT NULL,
        recommendations_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS grocery_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        foods_data JSON,
        analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS children_recommendations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        age_type VARCHAR(50) NOT NULL,
        age_value INT NOT NULL,
        recommendations_data JSON,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS user_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        activity_type VARCHAR(100) NOT NULL,
        details JSON,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
    ];

    for (const table of tables) {
      await this.execute(table);
    }
  }

  async execute(sql, params = []) {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database execute error:', error);
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async close() {
    try {
      if (this.pool) {
        await this.pool.end();
        console.log("Database connection pool closed");
      }
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }
}

module.exports = new Database();
