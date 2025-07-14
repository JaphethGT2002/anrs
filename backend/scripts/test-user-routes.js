const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

// Test data
const testUser = {
  name: 'Test User Routes',
  email: 'testuserroutes@example.com',
  password: 'TestPassword123'
};

let authToken = '';

async function setupTestUser() {
  console.log('🔧 Setting up test user...');
  
  try {
    // Try to register the user
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    authToken = registerResponse.data.token;
    console.log('✅ Test user created and logged in');
  } catch (error) {
    if (error.response?.status === 409) {
      // User exists, try to login
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      authToken = loginResponse.data.token;
      console.log('✅ Test user logged in');
    } else {
      throw error;
    }
  }
}

async function testUserRoutes() {
  console.log('🧪 Testing User Routes...\n');

  try {
    await setupTestUser();

    // Test 1: Get User Profile
    console.log('1. Testing Get User Profile...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (profileResponse.data.success) {
        console.log('✅ Get user profile successful');
        console.log('📝 Profile:', profileResponse.data.user);
      } else {
        console.log('❌ Get user profile failed:', profileResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Get profile error:', error.response?.data?.message || error.message);
    }

    // Test 2: Update User Profile
    console.log('\n2. Testing Update User Profile...');
    try {
      const updateData = {
        name: 'Updated Test User',
        email: testUser.email // Keep same email
      };

      const updateResponse = await axios.put(`${BASE_URL}/api/users/profile`, updateData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (updateResponse.data.success) {
        console.log('✅ Update user profile successful');
        console.log('📝 Updated profile:', updateResponse.data.user);
      } else {
        console.log('❌ Update user profile failed:', updateResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Update profile error:', error.response?.data?.message || error.message);
    }

    // Test 3: Change Password
    console.log('\n3. Testing Change Password...');
    try {
      const passwordData = {
        currentPassword: testUser.password,
        newPassword: 'NewTestPassword123'
      };

      const passwordResponse = await axios.put(`${BASE_URL}/api/users/password`, passwordData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (passwordResponse.data.success) {
        console.log('✅ Change password successful');
        // Update test user password for future tests
        testUser.password = passwordData.newPassword;
      } else {
        console.log('❌ Change password failed:', passwordResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Change password error:', error.response?.data?.message || error.message);
    }

    // Test 4: Get User Activities
    console.log('\n4. Testing Get User Activities...');
    try {
      const activitiesResponse = await axios.get(`${BASE_URL}/api/users/activities`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (activitiesResponse.data.success) {
        console.log('✅ Get user activities successful');
        console.log('📝 Activities count:', activitiesResponse.data.activities.length);
        console.log('📊 Pagination:', activitiesResponse.data.pagination);
      } else {
        console.log('❌ Get user activities failed:', activitiesResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Get activities error:', error.response?.data?.message || error.message);
    }

    // Test 5: Get User Statistics
    console.log('\n5. Testing Get User Statistics...');
    try {
      const statsResponse = await axios.get(`${BASE_URL}/api/users/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (statsResponse.data.success) {
        console.log('✅ Get user statistics successful');
        console.log('📊 Stats:', statsResponse.data.stats);
      } else {
        console.log('❌ Get user statistics failed:', statsResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Get stats error:', error.response?.data?.message || error.message);
    }

    // Test 6: Test Route
    console.log('\n6. Testing Test Route...');
    try {
      const testResponse = await axios.get(`${BASE_URL}/api/users/test`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      console.log('✅ Test route successful');
      console.log('📝 Response:', testResponse.data);
    } catch (error) {
      console.log('❌ Test route error:', error.response?.data?.message || error.message);
    }

    // Test 7: Unauthorized Access
    console.log('\n7. Testing Unauthorized Access...');
    try {
      const unauthorizedResponse = await axios.get(`${BASE_URL}/api/users/profile`);
      console.log('❌ Unauthorized access should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
      }
    }

    // Test 8: Invalid Profile Update
    console.log('\n8. Testing Invalid Profile Update...');
    try {
      const invalidUpdateData = {
        name: '', // Invalid: too short
        email: 'invalid-email' // Invalid: not an email
      };

      const invalidUpdateResponse = await axios.put(`${BASE_URL}/api/users/profile`, invalidUpdateData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      console.log('❌ Invalid profile update should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid profile update correctly rejected');
        console.log('📝 Validation errors:', error.response.data.errors);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 User Routes Tests Completed!');

  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }
}

// Run the tests
if (require.main === module) {
  testUserRoutes();
}

module.exports = { testUserRoutes };
