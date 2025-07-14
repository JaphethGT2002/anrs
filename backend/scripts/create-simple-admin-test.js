const bcrypt = require('bcryptjs');
const database = require('../config/mysql-database');

async function createTestAdmin() {
  try {
    console.log('🔧 Creating test admin...');
    
    // Connect to database
    await database.connect();
    
    // Hash password
    const password = 'AdminPass123';
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Create admin
    const sql = `
      INSERT INTO admins (name, email, password_hash, role, is_active)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      password_hash = VALUES(password_hash),
      updated_at = CURRENT_TIMESTAMP
    `;
    
    const result = await database.execute(sql, [
      'Test Admin',
      'admin@test.com',
      password_hash,
      'admin',
      true
    ]);
    
    console.log('✅ Test admin created successfully!');
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Password: AdminPass123');
    
    await database.close();
    
  } catch (error) {
    console.error('❌ Error creating test admin:', error);
    process.exit(1);
  }
}

createTestAdmin();
