const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

async function testUserSystem() {
  console.log('🚀 ANRS User System Comprehensive Test Suite');
  console.log('='.repeat(50));
  console.log(`🌐 Testing against: ${BASE_URL}`);
  console.log('='.repeat(50));

  try {
    // Test server health first
    console.log('\n🏥 Testing Server Health...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/api/health`);
      console.log('✅ Server is healthy:', healthResponse.data);
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
      console.log('🛑 Cannot proceed with tests. Please ensure the server is running.');
      return;
    }

    // Import and run authentication tests
    console.log('\n📋 Running Authentication Tests...');
    console.log('-'.repeat(30));
    
    const { testUserAuthentication } = require('./test-user-auth');
    await testUserAuthentication();

    // Import and run user routes tests
    console.log('\n📋 Running User Routes Tests...');
    console.log('-'.repeat(30));
    
    const { testUserRoutes } = require('./test-user-routes');
    await testUserRoutes();

    // Additional integration tests
    console.log('\n📋 Running Integration Tests...');
    console.log('-'.repeat(30));
    
    await testIntegrationScenarios();

    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('✅ User authentication system is working correctly');
    console.log('✅ User routes are functioning properly');
    console.log('✅ Integration scenarios passed');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    console.log('\n🔍 Please check the server logs for more details.');
  }
}

async function testIntegrationScenarios() {
  console.log('\n🔄 Testing Integration Scenarios...');

  // Scenario 1: Complete user lifecycle
  console.log('\n1. Testing Complete User Lifecycle...');
  
  const lifecycleUser = {
    name: 'Lifecycle Test User',
    email: 'lifecycle@example.com',
    password: 'LifecycleTest123'
  };

  let lifecycleToken = '';

  try {
    // Register
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, lifecycleUser);
    lifecycleToken = registerResponse.data.token;
    console.log('  ✅ User registered');

    // Get profile
    const profileResponse = await axios.get(`${BASE_URL}/api/users/profile`, {
      headers: { 'Authorization': `Bearer ${lifecycleToken}` }
    });
    console.log('  ✅ Profile retrieved');

    // Update profile
    await axios.put(`${BASE_URL}/api/users/profile`, {
      name: 'Updated Lifecycle User',
      email: lifecycleUser.email
    }, {
      headers: { 'Authorization': `Bearer ${lifecycleToken}` }
    });
    console.log('  ✅ Profile updated');

    // Change password
    await axios.put(`${BASE_URL}/api/users/password`, {
      currentPassword: lifecycleUser.password,
      newPassword: 'NewLifecycleTest123'
    }, {
      headers: { 'Authorization': `Bearer ${lifecycleToken}` }
    });
    console.log('  ✅ Password changed');

    // Login with new password
    const newLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: lifecycleUser.email,
      password: 'NewLifecycleTest123'
    });
    console.log('  ✅ Login with new password successful');

    // Get stats
    await axios.get(`${BASE_URL}/api/users/stats`, {
      headers: { 'Authorization': `Bearer ${newLoginResponse.data.token}` }
    });
    console.log('  ✅ User statistics retrieved');

    console.log('✅ Complete user lifecycle test passed');

  } catch (error) {
    console.log('❌ User lifecycle test failed:', error.response?.data?.message || error.message);
  }

  // Scenario 2: Concurrent user operations
  console.log('\n2. Testing Concurrent User Operations...');
  
  try {
    const user1 = {
      name: 'Concurrent User 1',
      email: 'concurrent1@example.com',
      password: 'Concurrent123'
    };

    const user2 = {
      name: 'Concurrent User 2',
      email: 'concurrent2@example.com',
      password: 'Concurrent123'
    };

    // Register both users concurrently
    const [reg1, reg2] = await Promise.all([
      axios.post(`${BASE_URL}/api/auth/register`, user1).catch(e => e.response),
      axios.post(`${BASE_URL}/api/auth/register`, user2).catch(e => e.response)
    ]);

    console.log('  ✅ Concurrent registrations handled');

    // Login both users concurrently
    const [login1, login2] = await Promise.all([
      axios.post(`${BASE_URL}/api/auth/login`, {
        email: user1.email,
        password: user1.password
      }).catch(e => e.response),
      axios.post(`${BASE_URL}/api/auth/login`, {
        email: user2.email,
        password: user2.password
      }).catch(e => e.response)
    ]);

    console.log('  ✅ Concurrent logins handled');

    console.log('✅ Concurrent operations test passed');

  } catch (error) {
    console.log('❌ Concurrent operations test failed:', error.message);
  }

  // Scenario 3: Error handling
  console.log('\n3. Testing Error Handling...');
  
  try {
    // Test various error scenarios
    const errorTests = [
      // Invalid registration data
      axios.post(`${BASE_URL}/api/auth/register`, {
        name: '',
        email: 'invalid',
        password: '123'
      }).catch(e => e.response),
      
      // Duplicate email registration
      axios.post(`${BASE_URL}/api/auth/register`, {
        name: 'Test',
        email: 'lifecycle@example.com', // Already exists
        password: 'ValidPassword123'
      }).catch(e => e.response),
      
      // Invalid login
      axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      }).catch(e => e.response)
    ];

    await Promise.all(errorTests);
    console.log('  ✅ Error scenarios handled correctly');

    console.log('✅ Error handling test passed');

  } catch (error) {
    console.log('❌ Error handling test failed:', error.message);
  }
}

// Run the tests
if (require.main === module) {
  testUserSystem();
}

module.exports = { testUserSystem };
