/**
 * Fix Admin Table Script
 * Drops and recreates the admin table with correct structure
 */

const database = require('../config/mysql-database');

async function fixAdminTable() {
  try {
    await database.connect();
    console.log('Connected to database');

    // Drop existing admin table
    console.log('Dropping existing admin table...');
    await database.execute("DROP TABLE IF EXISTS admins");
    console.log('Admin table dropped');

    // Create new admin table with correct structure
    console.log('Creating new admin table...');
    const createTableSQL = `
      CREATE TABLE admins (
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

    // Verify table structure
    console.log('\nVerifying table structure...');
    const result = await database.execute("DESCRIBE admins");
    console.log('Full result:', result);

    // Try different ways to access the columns
    const [columns, fields] = result;
    console.log('Columns:', columns);
    console.log('Fields:', fields);

    if (Array.isArray(columns)) {
      console.log('Admin table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } else {
      console.log('Single column result:', columns);
    }

    await database.close();
    console.log('\n✅ Admin table fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing admin table:', error);
  }
}

fixAdminTable();
