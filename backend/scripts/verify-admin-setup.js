/**
 * ANRS Admin Setup Verification Script
 * 
 * Quick verification script to check if admin authentication is properly set up
 * 
 * Usage: node scripts/verify-admin-setup.js
 */

const Admin = require('../models/Admin');
const database = require('../config/mysql-database');

async function verifyAdminSetup() {
  console.log('🔍 ANRS Admin Setup Verification');
  console.log('================================\n');

  let allChecks = true;

  try {
    // Check 1: Database Connection
    console.log('1. Checking database connection...');
    try {
      await database.connect();
      console.log('   ✅ Database connected successfully');
    } catch (error) {
      console.log('   ❌ Database connection failed:', error.message);
      allChecks = false;
    }

    // Check 2: Admin Table Exists
    console.log('\n2. Checking admin table...');
    try {
      const result = await database.execute("DESCRIBE admins");
      if (result && result[0] && result[0].length > 0) {
        console.log('   ✅ Admin table exists');
      } else {
        console.log('   ❌ Admin table does not exist');
        allChecks = false;
      }
    } catch (error) {
      console.log('   ❌ Admin table does not exist');
      allChecks = false;
    }

    // Check 3: Admin Table Structure
    console.log('\n3. Checking admin table structure...');
    try {
      const result = await database.execute("DESCRIBE admins");
      const columns = result[0];
      const expectedColumns = ['id', 'name', 'email', 'password_hash', 'role', 'is_active', 'last_login', 'created_at', 'updated_at'];
      const actualColumns = columns.map(col => col.Field);

      const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
      if (missingColumns.length === 0) {
        console.log('   ✅ Admin table structure is correct');
      } else {
        console.log(`   ❌ Missing columns: ${missingColumns.join(', ')}`);
        allChecks = false;
      }
    } catch (error) {
      console.log('   ❌ Error checking table structure:', error.message);
      allChecks = false;
    }

    // Check 4: Admin Model Functionality
    console.log('\n4. Checking admin model functionality...');
    try {
      const stats = await Admin.getStats();
      console.log('   ✅ Admin model is working');
      console.log(`      📊 Total admins: ${stats.total_admins}`);
      console.log(`      👑 Super admins: ${stats.super_admins}`);
      console.log(`      👤 Regular admins: ${stats.regular_admins}`);
      console.log(`      ✅ Active admins: ${stats.active_admins}`);
    } catch (error) {
      console.log('   ❌ Admin model error:', error.message);
      allChecks = false;
    }

    // Check 5: Environment Variables
    console.log('\n5. Checking environment configuration...');
    const requiredEnvVars = ['JWT_SECRET', 'ADMIN_REGISTRATION_KEY'];
    let envChecks = true;
    
    requiredEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        console.log(`   ✅ ${envVar} is set`);
      } else {
        console.log(`   ❌ ${envVar} is not set`);
        envChecks = false;
        allChecks = false;
      }
    });

    if (envChecks) {
      console.log('   ✅ Environment configuration is complete');
    }

    // Check 6: Dependencies
    console.log('\n6. Checking required dependencies...');
    const requiredDeps = ['bcryptjs', 'jsonwebtoken', 'express-validator', 'express-rate-limit'];
    let depChecks = true;
    
    requiredDeps.forEach(dep => {
      try {
        require(dep);
        console.log(`   ✅ ${dep} is installed`);
      } catch (error) {
        console.log(`   ❌ ${dep} is missing`);
        depChecks = false;
        allChecks = false;
      }
    });

    if (depChecks) {
      console.log('   ✅ All required dependencies are installed');
    }

    // Final Result
    console.log('\n🎯 Verification Results');
    console.log('=======================');
    
    if (allChecks) {
      console.log('✅ All checks passed! Admin authentication system is ready.');
      console.log('\n📋 Next steps:');
      
      const stats = await Admin.getStats();
      if (stats.super_admins === 0) {
        console.log('   1. Create super admin: npm run create-super-admin');
        console.log('   2. Start server: npm run dev');
        console.log("   3. Access dashboard: http://localhost:3002/admin/");
      } else {
        console.log('   1. Start server: npm run dev');
        console.log("   2. Access dashboard: http://localhost:3002/admin/");
        console.log('   3. Login with your admin credentials');
      }
    } else {
      console.log('❌ Some checks failed. Please fix the issues above.');
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Ensure XAMPP MySQL is running');
      console.log('   2. Check .env file configuration');
      console.log('   3. Run: npm install (to install dependencies)');
      console.log('   4. Run: npm run setup-admin (for complete setup)');
    }

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    allChecks = false;
  } finally {
    await database.close();
  }

  process.exit(allChecks ? 0 : 1);
}

// Run verification
if (require.main === module) {
  verifyAdminSetup().catch((error) => {
    console.error('❌ Verification error:', error);
    process.exit(1);
  });
}

module.exports = { verifyAdminSetup };
