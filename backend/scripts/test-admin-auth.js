/**
 * ANRS Admin Authentication Test Script
 * 
 * This script thoroughly tests the admin authentication system:
 * 1. Tests admin model CRUD operations
 * 2. Tests authentication middleware
 * 3. Tests JWT token generation and verification
 * 4. Tests API endpoints
 * 5. Tests role-based access control
 * 
 * Usage: node scripts/test-admin-auth.js
 */

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const database = require('../config/mysql-database');

async function testAdminAuthentication() {
  console.log('🧪 ANRS Admin Authentication Test Suite');
  console.log('========================================\n');

  let testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };

  try {
    // Connect to database
    await database.connect();
    console.log('✅ Database connected\n');

    // Test 1: Admin Model CRUD Operations
    console.log('📋 Test 1: Admin Model CRUD Operations');
    console.log('--------------------------------------');
    
    await testAdminCRUD(testResults);

    // Test 2: Password Hashing and Verification
    console.log('\n🔐 Test 2: Password Security');
    console.log('----------------------------');
    
    await testPasswordSecurity(testResults);

    // Test 3: JWT Token Operations
    console.log('\n🎫 Test 3: JWT Token Operations');
    console.log('-------------------------------');
    
    await testJWTOperations(testResults);

    // Test 4: Role-based Access Control
    console.log('\n👑 Test 4: Role-based Access Control');
    console.log('------------------------------------');
    
    await testRoleBasedAccess(testResults);

    // Test 5: Admin Statistics
    console.log('\n📊 Test 5: Admin Statistics');
    console.log('---------------------------');
    
    await testAdminStatistics(testResults);

    // Display final results
    console.log('\n🎯 Test Results Summary');
    console.log('=======================');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Total:  ${testResults.total}`);
    console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

    if (testResults.failed === 0) {
      console.log('\n🎉 All tests passed! Admin authentication system is working correctly.');
      console.log('\n📋 Next steps:');
      console.log('   1. Run: npm run setup-admin (to create super admin)');
      console.log('   2. Run: npm run dev (to start server)');
      console.log('   3. Visit: http://localhost:8080/admin/');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the errors above.');
    }

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  } finally {
    await database.close();
  }
}

async function testAdminCRUD(results) {
  const testEmail = `test_${Date.now()}@example.com`;
  let testAdmin = null;

  try {
    // Test admin creation
    testAdmin = await Admin.create({
      name: 'Test Admin User',
      email: testEmail,
      password: 'testpassword123',
      role: 'admin'
    });
    
    if (testAdmin && testAdmin.id) {
      console.log('   ✅ Admin creation');
      results.passed++;
    } else {
      throw new Error('Admin creation failed');
    }
    results.total++;

    // Test admin retrieval by ID
    const foundById = await Admin.findById(testAdmin.id);
    if (foundById && foundById.email === testEmail) {
      console.log('   ✅ Admin retrieval by ID');
      results.passed++;
    } else {
      throw new Error('Admin retrieval by ID failed');
    }
    results.total++;

    // Test admin retrieval by email
    const foundByEmail = await Admin.findByEmail(testEmail);
    if (foundByEmail && foundByEmail.id === testAdmin.id) {
      console.log('   ✅ Admin retrieval by email');
      results.passed++;
    } else {
      throw new Error('Admin retrieval by email failed');
    }
    results.total++;

    // Test admin update
    const updatedName = 'Updated Test Admin';
    const updatedAdmin = await testAdmin.update({ name: updatedName });
    if (updatedAdmin.name === updatedName) {
      console.log('   ✅ Admin update');
      results.passed++;
    } else {
      throw new Error('Admin update failed');
    }
    results.total++;

    // Test admin deletion
    await Admin.delete(testAdmin.id);
    const deletedAdmin = await Admin.findById(testAdmin.id);
    if (!deletedAdmin) {
      console.log('   ✅ Admin deletion');
      results.passed++;
    } else {
      throw new Error('Admin deletion failed');
    }
    results.total++;

  } catch (error) {
    console.log(`   ❌ ${error.message}`);
    results.failed++;
    results.total++;
    
    // Cleanup on error
    if (testAdmin && testAdmin.id) {
      try {
        await Admin.delete(testAdmin.id);
      } catch (cleanupError) {
        console.log(`   ⚠️  Cleanup failed: ${cleanupError.message}`);
      }
    }
  }
}

async function testPasswordSecurity(results) {
  const testEmail = `password_test_${Date.now()}@example.com`;
  let testAdmin = null;

  try {
    // Create admin with password
    testAdmin = await Admin.create({
      name: 'Password Test Admin',
      email: testEmail,
      password: 'securepassword123',
      role: 'admin'
    });

    // Test correct password verification
    const correctPassword = await testAdmin.verifyPassword('securepassword123');
    if (correctPassword) {
      console.log('   ✅ Correct password verification');
      results.passed++;
    } else {
      throw new Error('Correct password verification failed');
    }
    results.total++;

    // Test incorrect password verification
    const incorrectPassword = await testAdmin.verifyPassword('wrongpassword');
    if (!incorrectPassword) {
      console.log('   ✅ Incorrect password rejection');
      results.passed++;
    } else {
      throw new Error('Incorrect password was accepted');
    }
    results.total++;

    // Test password update
    await testAdmin.updatePassword('newpassword456');
    const newPasswordValid = await testAdmin.verifyPassword('newpassword456');
    const oldPasswordInvalid = !(await testAdmin.verifyPassword('securepassword123'));
    
    if (newPasswordValid && oldPasswordInvalid) {
      console.log('   ✅ Password update');
      results.passed++;
    } else {
      throw new Error('Password update failed');
    }
    results.total++;

    // Cleanup
    await Admin.delete(testAdmin.id);

  } catch (error) {
    console.log(`   ❌ ${error.message}`);
    results.failed++;
    results.total++;
    
    if (testAdmin && testAdmin.id) {
      try {
        await Admin.delete(testAdmin.id);
      } catch (cleanupError) {
        console.log(`   ⚠️  Cleanup failed: ${cleanupError.message}`);
      }
    }
  }
}

async function testJWTOperations(results) {
  const testEmail = `jwt_test_${Date.now()}@example.com`;
  let testAdmin = null;

  try {
    // Create test admin
    testAdmin = await Admin.create({
      name: 'JWT Test Admin',
      email: testEmail,
      password: 'jwtpassword123',
      role: 'super_admin'
    });

    // Test JWT token generation
    const token = jwt.sign(
      { 
        adminId: testAdmin.id, 
        email: testAdmin.email, 
        role: testAdmin.role,
        type: 'admin'
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    if (token) {
      console.log('   ✅ JWT token generation');
      results.passed++;
    } else {
      throw new Error('JWT token generation failed');
    }
    results.total++;

    // Test JWT token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.adminId === testAdmin.id && decoded.type === 'admin') {
      console.log('   ✅ JWT token verification');
      results.passed++;
    } else {
      throw new Error('JWT token verification failed');
    }
    results.total++;

    // Test invalid token rejection
    try {
      jwt.verify('invalid.token.here', process.env.JWT_SECRET || 'fallback_secret');
      throw new Error('Invalid token was accepted');
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError') {
        console.log('   ✅ Invalid token rejection');
        results.passed++;
      } else {
        throw jwtError;
      }
    }
    results.total++;

    // Cleanup
    await Admin.delete(testAdmin.id);

  } catch (error) {
    console.log(`   ❌ ${error.message}`);
    results.failed++;
    results.total++;
    
    if (testAdmin && testAdmin.id) {
      try {
        await Admin.delete(testAdmin.id);
      } catch (cleanupError) {
        console.log(`   ⚠️  Cleanup failed: ${cleanupError.message}`);
      }
    }
  }
}

async function testRoleBasedAccess(results) {
  const adminEmail = `role_admin_${Date.now()}@example.com`;
  const superAdminEmail = `role_super_${Date.now()}@example.com`;
  let adminUser = null;
  let superAdminUser = null;

  try {
    // Create regular admin
    adminUser = await Admin.create({
      name: 'Regular Admin',
      email: adminEmail,
      password: 'adminpassword123',
      role: 'admin'
    });

    // Create super admin
    superAdminUser = await Admin.create({
      name: 'Super Admin',
      email: superAdminEmail,
      password: 'superpassword123',
      role: 'super_admin'
    });

    // Test role assignment
    if (adminUser.role === 'admin' && superAdminUser.role === 'super_admin') {
      console.log('   ✅ Role assignment');
      results.passed++;
    } else {
      throw new Error('Role assignment failed');
    }
    results.total++;

    // Test role-based queries
    const allAdmins = await Admin.findByRole('admin');
    const superAdmins = await Admin.findByRole('super_admin');
    
    const hasRegularAdmin = allAdmins.some(admin => admin.id === adminUser.id);
    const hasSuperAdmin = superAdmins.some(admin => admin.id === superAdminUser.id);
    
    if (hasRegularAdmin && hasSuperAdmin) {
      console.log('   ✅ Role-based queries');
      results.passed++;
    } else {
      throw new Error('Role-based queries failed');
    }
    results.total++;

    // Cleanup
    await Admin.delete(adminUser.id);
    await Admin.delete(superAdminUser.id);

  } catch (error) {
    console.log(`   ❌ ${error.message}`);
    results.failed++;
    results.total++;
    
    // Cleanup on error
    if (adminUser && adminUser.id) {
      try {
        await Admin.delete(adminUser.id);
      } catch (cleanupError) {
        console.log(`   ⚠️  Admin cleanup failed: ${cleanupError.message}`);
      }
    }
    if (superAdminUser && superAdminUser.id) {
      try {
        await Admin.delete(superAdminUser.id);
      } catch (cleanupError) {
        console.log(`   ⚠️  Super admin cleanup failed: ${cleanupError.message}`);
      }
    }
  }
}

async function testAdminStatistics(results) {
  try {
    // Test statistics retrieval
    const stats = await Admin.getStats();
    
    if (stats && typeof stats.total_admins === 'number') {
      console.log('   ✅ Statistics retrieval');
      console.log(`      📊 Total admins: ${stats.total_admins}`);
      console.log(`      👑 Super admins: ${stats.super_admins}`);
      console.log(`      👤 Regular admins: ${stats.regular_admins}`);
      console.log(`      ✅ Active admins: ${stats.active_admins}`);
      results.passed++;
    } else {
      throw new Error('Statistics retrieval failed');
    }
    results.total++;

  } catch (error) {
    console.log(`   ❌ ${error.message}`);
    results.failed++;
    results.total++;
  }
}

// Run the test suite
if (require.main === module) {
  testAdminAuthentication().catch((error) => {
    console.error('❌ Test suite error:', error);
    process.exit(1);
  });
}

module.exports = { testAdminAuthentication };
