const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

// Test data
const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'TestPassword123'
};

let authToken = '';

async function testUserAuthentication() {
  console.log('🧪 Testing User Authentication System...\n');

  try {
    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
      
      if (registerResponse.data.success) {
        console.log('✅ User registration successful');
        console.log('📝 User:', registerResponse.data.user);
        authToken = registerResponse.data.token;
        console.log('🔑 Token received:', authToken.substring(0, 20) + '...');
      } else {
        console.log('❌ User registration failed:', registerResponse.data.message);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️  User already exists, proceeding with login test...');
      } else {
        console.log('❌ Registration error:', error.response?.data?.message || error.message);
      }
    }

    // Test 2: User Login
    console.log('\n2. Testing User Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResponse.data.success) {
        console.log('✅ User login successful');
        console.log('📝 User:', loginResponse.data.user);
        authToken = loginResponse.data.token;
        console.log('🔑 Token received:', authToken.substring(0, 20) + '...');
      } else {
        console.log('❌ User login failed:', loginResponse.data.message);
        return;
      }
    } catch (error) {
      console.log('❌ Login error:', error.response?.data?.message || error.message);
      return;
    }

    // Test 3: Token Verification
    console.log('\n3. Testing Token Verification...');
    try {
      const verifyResponse = await axios.get(`${BASE_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (verifyResponse.data.valid) {
        console.log('✅ Token verification successful');
        console.log('📝 User:', verifyResponse.data.user);
      } else {
        console.log('❌ Token verification failed:', verifyResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Verification error:', error.response?.data?.message || error.message);
    }

    // Test 4: Get Profile
    console.log('\n4. Testing Get Profile...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (profileResponse.data.success) {
        console.log('✅ Get profile successful');
        console.log('📝 User profile:', profileResponse.data.user);
      } else {
        console.log('❌ Get profile failed:', profileResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Get profile error:', error.response?.data?.message || error.message);
    }

    // Test 5: Invalid Token
    console.log('\n5. Testing Invalid Token...');
    try {
      const invalidResponse = await axios.get(`${BASE_URL}/api/auth/verify`, {
        headers: {
          'Authorization': 'Bearer invalid_token'
        }
      });
      
      console.log('❌ Invalid token should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid token correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
      }
    }

    // Test 6: No Token
    console.log('\n6. Testing No Token...');
    try {
      const noTokenResponse = await axios.get(`${BASE_URL}/api/auth/verify`);
      console.log('❌ No token should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ No token correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
      }
    }

    // Test 7: Invalid Login Credentials
    console.log('\n7. Testing Invalid Login Credentials...');
    try {
      const invalidLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: 'wrongpassword'
      });
      
      console.log('❌ Invalid credentials should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid credentials correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 User Authentication Tests Completed!');
    console.log('🔑 Auth Token for further testing:', authToken);

  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }
}

// Run the tests
if (require.main === module) {
  testUserAuthentication();
}

module.exports = { testUserAuthentication, testUser };
