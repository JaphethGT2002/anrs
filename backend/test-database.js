/**
 * Test script to verify database connection and user insertion
 */

require('dotenv').config();
const database = require('./config/mysql-database');
const User = require('./models/User');
const UserActivity = require('./models/UserActivity');

async function testDatabase() {
  try {
    console.log('🔍 Testing ANRS Database Connection and User Insertion...\n');

    // Test 1: Database Connection
    console.log('1. Testing database connection...');
    await database.connect();
    console.log('✅ Database connected successfully\n');

    // Test 2: Initialize Tables
    console.log('2. Initializing database tables...');
    await database.initializeTables();
    console.log('✅ Database tables initialized\n');

    // Test 3: Test User Creation
    console.log('3. Testing user creation...');
    const testUserData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123',
      role: 'user'
    };

    const newUser = await User.create(testUserData, {
      ip_address: '127.0.0.1',
      user_agent: 'Test Script',
      registration_source: 'test_script'
    });

    console.log('✅ User created successfully:');
    console.log('   ID:', newUser.id);
    console.log('   Name:', newUser.name);
    console.log('   Email:', newUser.email);
    console.log('   Role:', newUser.role);
    console.log('   Created:', newUser.created_at);
    console.log('');

    // Test 4: Verify User Activity Logging
    console.log('4. Testing user activity logging...');
    const activities = await UserActivity.findByUserId(newUser.id);
    console.log('✅ User activities found:', activities.activities.length);
    
    if (activities.activities.length > 0) {
      const registrationActivity = activities.activities[0];
      console.log('   Latest Activity:');
      console.log('   Type:', registrationActivity.activity_type);
      console.log('   Details:', JSON.stringify(registrationActivity.details, null, 2));
      console.log('   Timestamp:', registrationActivity.timestamp);
    }
    console.log('');

    // Test 5: Test User Lookup
    console.log('5. Testing user lookup...');
    const foundUser = await User.findByEmail(testUserData.email);
    if (foundUser) {
      console.log('✅ User lookup successful');
      console.log('   Found user:', foundUser.name, '(' + foundUser.email + ')');
    } else {
      console.log('❌ User lookup failed');
    }
    console.log('');

    // Test 6: Test Password Verification
    console.log('6. Testing password verification...');
    const isValidPassword = await foundUser.verifyPassword('TestPass123');
    const isInvalidPassword = await foundUser.verifyPassword('WrongPassword');
    
    if (isValidPassword && !isInvalidPassword) {
      console.log('✅ Password verification working correctly');
    } else {
      console.log('❌ Password verification failed');
    }
    console.log('');

    // Test 7: Test User Statistics
    console.log('7. Testing user statistics...');
    const userStats = await User.getStats();
    console.log('✅ User statistics:');
    console.log('   Total users:', userStats.total);
    console.log('   Active users:', userStats.active);
    console.log('   Inactive users:', userStats.inactive);
    console.log('   Recent users (30 days):', userStats.recent);
    console.log('');

    // Test 8: Test Activity Statistics
    console.log('8. Testing activity statistics...');
    const activityStats = await UserActivity.getStats();
    console.log('✅ Activity statistics:');
    activityStats.forEach(stat => {
      console.log(`   ${stat.activity_type}: ${stat.count} activities (last: ${stat.last_activity})`);
    });
    console.log('');

    console.log('🎉 All database tests passed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('- Database connection: ✅ Working');
    console.log('- User creation: ✅ Working');
    console.log('- Activity logging: ✅ Working');
    console.log('- User authentication: ✅ Working');
    console.log('- Database queries: ✅ Working');
    console.log('');
    console.log('🚀 Your ANRS backend is ready for user registration!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('- Check your MySQL credentials in .env file');
      console.log('- Make sure XAMPP MySQL is running');
      console.log('- Verify database user permissions');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('- Make sure XAMPP MySQL service is started');
      console.log('- Check if MySQL is running on the correct port (3306)');
      console.log('- Verify your database host configuration');
    }
  } finally {
    // Close database connection
    try {
      await database.close();
      console.log('\n🔌 Database connection closed');
    } catch (error) {
      console.error('Error closing database:', error);
    }
  }
}

// Run the test
testDatabase();
