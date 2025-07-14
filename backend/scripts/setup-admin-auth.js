/**
 * ANRS Admin Authentication Setup Script
 * 
 * This script sets up the complete admin authentication system:
 * 1. Verifies database connection
 * 2. Creates admin table if it doesn't exist
 * 3. Tests admin model functionality
 * 4. Provides option to create first super admin
 * 
 * Usage: node scripts/setup-admin-auth.js
 */

const readline = require('readline');
const Admin = require('../models/Admin');
const database = require('../config/mysql-database');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function setupAdminAuth() {
  console.log('🚀 ANRS Admin Authentication Setup');
  console.log('===================================\n');

  try {
    // Step 1: Test database connection
    console.log('1. Testing database connection...');
    await database.connect();
    console.log('   ✅ Database connected successfully\n');

    // Step 2: Initialize tables (including admin table)
    console.log('2. Initializing database tables...');
    await database.initializeTables();
    console.log('   ✅ Database tables initialized\n');

    // Step 3: Verify admin table structure
    console.log('3. Verifying admin table structure...');
    const result = await database.execute("DESCRIBE admins");

    // Try different ways to access the columns
    let columns;
    if (Array.isArray(result) && result.length > 0) {
      if (Array.isArray(result[0])) {
        columns = result[0];
      } else {
        columns = result;
      }
    } else {
      columns = result;
    }

    if (!columns || (Array.isArray(columns) && columns.length === 0)) {
      throw new Error('Admin table was not created properly');
    }

    // Handle the case where we have the columns
    let actualColumns = [];
    if (Array.isArray(columns)) {
      actualColumns = columns.map(col => col.Field);
    } else if (columns.Field) {
      actualColumns = [columns.Field];
    }

    const expectedColumns = ['id', 'name', 'email', 'password_hash', 'role', 'is_active', 'last_login', 'created_at', 'updated_at'];
    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));

    if (missingColumns.length > 0) {
      console.log(`   ⚠️  Some columns missing: ${missingColumns.join(', ')}`);
      console.log('   ✅ Admin table exists (will continue)\n');
    } else {
      console.log('   ✅ Admin table structure verified\n');
    }

    // Step 4: Test admin model functionality
    console.log('4. Testing admin model functionality...');

    // Test creating a temporary admin
    const testEmail = `test_${Date.now()}@example.com`;
    const testAdmin = await Admin.create({
      name: 'Test Admin',
      email: testEmail,
      password: 'testpassword123',
      role: 'admin'
    });

    if (!testAdmin || !testAdmin.id) {
      throw new Error('Admin creation failed - no admin returned or no ID');
    }
    console.log('   ✅ Admin creation test passed');

    // Test finding admin
    const foundAdmin = await Admin.findById(testAdmin.id);
    if (!foundAdmin || foundAdmin.email !== testEmail) {
      throw new Error('Admin retrieval test failed');
    }
    console.log('   ✅ Admin retrieval test passed');

    // Test password verification
    const isValidPassword = await foundAdmin.verifyPassword('testpassword123');
    if (!isValidPassword) {
      throw new Error('Password verification test failed');
    }
    console.log('   ✅ Password verification test passed');

    // Clean up test admin
    await testAdmin.delete();
    console.log('   ✅ Test cleanup completed\n');

    // Step 5: Check for existing admins
    console.log('5. Checking existing admin accounts...');
    const stats = await Admin.getStats();
    console.log(`   📊 Total admins: ${stats.total_admins}`);
    console.log(`   👑 Super admins: ${stats.super_admins}`);
    console.log(`   👤 Regular admins: ${stats.regular_admins}`);
    console.log(`   ✅ Active admins: ${stats.active_admins}\n`);

    // Step 6: Offer to create super admin if none exists
    const superAdminCount = parseInt(stats.super_admins) || 0;
    if (superAdminCount === 0) {
      console.log('⚠️  No super admin found in the system.');
      const createSuperAdmin = await question('Would you like to create a super admin now? (Y/n): ');

      if (createSuperAdmin.toLowerCase() !== 'n' && createSuperAdmin.toLowerCase() !== 'no') {
        await createFirstSuperAdmin();
      }
    } else {
      console.log('✅ Super admin already exists in the system.');
    }

    console.log('\n🎉 Admin authentication setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Access admin dashboard: http://localhost:8080/admin/');
    console.log('   3. Login with your admin credentials');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Ensure XAMPP MySQL is running');
    console.error('   2. Check database configuration in .env file');
    console.error('   3. Verify database exists and is accessible');
    console.error('   4. Check server logs for detailed errors');
    process.exit(1);
  } finally {
    rl.close();
    await database.close();
  }
}

async function createFirstSuperAdmin() {
  console.log('\n👑 Creating Super Admin Account');
  console.log('================================\n');

  try {
    // Get admin details
    const name = await question('Full Name: ');
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    const email = await question('Email Address: ');
    if (!email || !isValidEmail(email)) {
      throw new Error('Please provide a valid email address');
    }

    // Check if email already exists
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      throw new Error('An admin with this email already exists');
    }

    const password = await question('Password (min 6 chars): ');
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const confirmPassword = await question('Confirm Password: ');
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    console.log('\n📝 Creating super admin account...');

    // Create the super admin
    const admin = await Admin.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: 'super_admin'
    });

    console.log('✅ Super admin created successfully!');
    console.log('\n📋 Account Details:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    throw error;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\nOperation cancelled by user.');
  rl.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nOperation terminated.');
  rl.close();
  process.exit(0);
});

// Run the script
if (require.main === module) {
  setupAdminAuth().catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { setupAdminAuth };
