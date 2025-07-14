const database = require('../config/mysql-database');
const bcrypt = require('bcryptjs');
const UserActivity = require('./UserActivity');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.role = data.role || 'user';
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new user
  static async create(userData, activityDetails = {}) {
    const { name, email, password, role = 'user' } = userData;

    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (name, email, password_hash, role, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await database.execute(sql, [
      name,
      email,
      password_hash,
      role,
      true
    ]);

    // Get the created user
    const newUser = await User.findById(result.insertId);

    // Log registration activity
    try {
      await UserActivity.logRegistration(newUser.id, {
        registration_method: 'web_signup',
        user_role: role,
        ...activityDetails
      });
    } catch (error) {
      console.warn('Failed to log registration activity:', error);
      // Don't fail user creation if activity logging fails
    }

    return newUser;
  }

  // Find user by ID
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const userData = await database.get(sql, [id]);
    
    return userData ? new User(userData) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const userData = await database.get(sql, [email]);
    
    return userData ? new User(userData) : null;
  }

  // Get all users with pagination
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      role = null,
      isActive = null 
    } = options;
    
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params = [];
    
    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }
    
    if (isActive !== null) {
      sql += ' AND is_active = ?';
      params.push(isActive);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const users = await database.all(sql, params);
    
    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];
    
    if (search) {
      countSql += ' AND (name LIKE ? OR email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (role) {
      countSql += ' AND role = ?';
      countParams.push(role);
    }
    
    if (isActive !== null) {
      countSql += ' AND is_active = ?';
      countParams.push(isActive);
    }
    
    const countResult = await database.get(countSql, countParams);
    const total = countResult.total;
    
    return {
      users: users.map(userData => new User(userData)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Update user profile
  async updateProfile(updateData) {
    const { name, email } = updateData;
    
    const sql = `
      UPDATE users 
      SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await database.execute(sql, [name, email, this.id]);
    
    // Update instance properties
    this.name = name;
    this.email = email;
    this.updated_at = new Date();

    return this;
  }

  // Update password
  async updatePassword(newPassword) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    const sql = `
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await database.execute(sql, [password_hash, this.id]);
    this.password_hash = password_hash;

    return this;
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }

  // Toggle active status
  async toggleStatus() {
    const newStatus = !this.is_active;
    
    const sql = `
      UPDATE users 
      SET is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await database.execute(sql, [newStatus, this.id]);
    this.is_active = newStatus;

    return this;
  }

  // Delete user
  async delete() {
    const sql = 'DELETE FROM users WHERE id = ?';
    await database.execute(sql, [this.id]);
    return true;
  }

  // Check if user exists by email
  static async existsByEmail(email) {
    const sql = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const result = await database.get(sql, [email]);
    return result.count > 0;
  }

  // Get user statistics
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as recent
      FROM users
    `;
    
    return await database.get(sql);
  }

  // Convert to JSON (safe - excludes password)
  toJSON() {
    const { password_hash, ...safeData } = this;
    return safeData;
  }

  // Convert to safe JSON for public API
  toSafeJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      is_active: this.is_active,
      created_at: this.created_at
    };
  }
}

module.exports = User;
