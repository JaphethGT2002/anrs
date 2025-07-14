/**
 * Check Admin Table Structure
 */

const database = require('../config/mysql-database');

async function checkAdminTable() {
  try {
    await database.connect();
    console.log('Connected to database');

    // Show all tables
    const [allTables] = await database.execute("SHOW TABLES");
    console.log('All tables:', allTables);

    // Check if admin table exists
    const [tables] = await database.execute("SHOW TABLES LIKE 'admins'");
    console.log('Admin table exists:', tables.length > 0);

    if (tables.length === 0) {
      console.log('\nCreating admin table...');
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role ENUM('admin', 'super_admin') DEFAULT 'admin',
          is_active BOOLEAN DEFAULT TRUE,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_role (role),
          INDEX idx_is_active (is_active)
        )
      `;

      await database.execute(createTableSQL);
      console.log('Admin table created successfully');
    }

    // Get table structure
    const [columns] = await database.execute("DESCRIBE admins");
    console.log('\nAdmin table structure:');
    console.log(columns);

    // Count admins
    const [count] = await database.execute("SELECT COUNT(*) as count FROM admins");
    console.log('\nAdmin count:', count[0].count);

    await database.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminTable();
