const database = require('../config/mysql-database');

class UserActivity {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.activity_type = data.activity_type;
    this.details = data.details;
    this.timestamp = data.timestamp;
  }

  // Create a new user activity record
  static async create(activityData) {
    const { user_id, activity_type, details = null } = activityData;

    const sql = `
      INSERT INTO user_activity (user_id, activity_type, details)
      VALUES (?, ?, ?)
    `;

    const result = await database.execute(sql, [
      user_id,
      activity_type,
      details ? JSON.stringify(details) : null
    ]);

    return await UserActivity.findById(result.insertId);
  }

  // Find activity by ID
  static async findById(id) {
    const sql = 'SELECT * FROM user_activity WHERE id = ?';
    const activityData = await database.get(sql, [id]);
    
    if (activityData) {
      // Parse JSON details if present
      if (activityData.details) {
        try {
          activityData.details = JSON.parse(activityData.details);
        } catch (error) {
          console.warn('Failed to parse activity details JSON:', error);
        }
      }
      return new UserActivity(activityData);
    }
    
    return null;
  }

  // Get activities for a specific user
  static async findByUserId(userId, options = {}) {
    const { 
      page = 1, 
      limit = 20, 
      activity_type = null,
      startDate = null,
      endDate = null
    } = options;
    
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM user_activity WHERE user_id = ?';
    const params = [userId];
    
    if (activity_type) {
      sql += ' AND activity_type = ?';
      params.push(activity_type);
    }
    
    if (startDate) {
      sql += ' AND timestamp >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      sql += ' AND timestamp <= ?';
      params.push(endDate);
    }
    
    sql += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const activities = await database.all(sql, params);
    
    // Parse JSON details for each activity
    const parsedActivities = activities.map(activity => {
      if (activity.details) {
        try {
          activity.details = JSON.parse(activity.details);
        } catch (error) {
          console.warn('Failed to parse activity details JSON:', error);
        }
      }
      return new UserActivity(activity);
    });
    
    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM user_activity WHERE user_id = ?';
    const countParams = [userId];
    
    if (activity_type) {
      countSql += ' AND activity_type = ?';
      countParams.push(activity_type);
    }
    
    if (startDate) {
      countSql += ' AND timestamp >= ?';
      countParams.push(startDate);
    }
    
    if (endDate) {
      countSql += ' AND timestamp <= ?';
      countParams.push(endDate);
    }
    
    const countResult = await database.get(countSql, countParams);
    const total = countResult.total;
    
    return {
      activities: parsedActivities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get all activities with pagination (admin function)
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 50, 
      activity_type = null,
      user_id = null,
      startDate = null,
      endDate = null
    } = options;
    
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT ua.*, u.name as user_name, u.email as user_email 
      FROM user_activity ua 
      LEFT JOIN users u ON ua.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (user_id) {
      sql += ' AND ua.user_id = ?';
      params.push(user_id);
    }
    
    if (activity_type) {
      sql += ' AND ua.activity_type = ?';
      params.push(activity_type);
    }
    
    if (startDate) {
      sql += ' AND ua.timestamp >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      sql += ' AND ua.timestamp <= ?';
      params.push(endDate);
    }
    
    sql += ' ORDER BY ua.timestamp DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const activities = await database.all(sql, params);
    
    // Parse JSON details for each activity
    const parsedActivities = activities.map(activity => {
      if (activity.details) {
        try {
          activity.details = JSON.parse(activity.details);
        } catch (error) {
          console.warn('Failed to parse activity details JSON:', error);
        }
      }
      return new UserActivity(activity);
    });
    
    return {
      activities: parsedActivities,
      pagination: {
        page,
        limit,
        total: activities.length
      }
    };
  }

  // Get activity statistics
  static async getStats(userId = null) {
    let sql = `
      SELECT 
        activity_type,
        COUNT(*) as count,
        MAX(timestamp) as last_activity
      FROM user_activity
    `;
    const params = [];
    
    if (userId) {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }
    
    sql += ' GROUP BY activity_type ORDER BY count DESC';
    
    return await database.all(sql, params);
  }

  // Log user registration activity
  static async logRegistration(userId, details = {}) {
    return await UserActivity.create({
      user_id: userId,
      activity_type: 'registration',
      details: {
        source: 'web_signup',
        ip_address: details.ip_address || null,
        user_agent: details.user_agent || null,
        ...details
      }
    });
  }

  // Log user login activity
  static async logLogin(userId, details = {}) {
    return await UserActivity.create({
      user_id: userId,
      activity_type: 'login',
      details: {
        source: 'web_login',
        ip_address: details.ip_address || null,
        user_agent: details.user_agent || null,
        ...details
      }
    });
  }

  // Log user logout activity
  static async logLogout(userId, details = {}) {
    return await UserActivity.create({
      user_id: userId,
      activity_type: 'logout',
      details: {
        source: 'web_logout',
        ip_address: details.ip_address || null,
        user_agent: details.user_agent || null,
        ...details
      }
    });
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      activity_type: this.activity_type,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

module.exports = UserActivity;
