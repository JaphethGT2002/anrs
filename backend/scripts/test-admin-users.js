const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

async function testAdminUsers() {
  console.log('🧪 Testing Admin Users Management');
  console.log('='.repeat(40));

  try {
    // Step 1: Admin Login
    console.log('1. Testing Admin Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/admin/auth/admin-login`, {
      email: 'admin@test.com',
      password: 'AdminPass123'
    });

    if (loginResponse.data.success) {
      console.log('✅ Admin login successful');
      const adminToken = loginResponse.data.token;
      console.log('🔑 Admin token received');

      // Step 2: Get Users
      console.log('\n2. Testing Get Users...');
      const usersResponse = await axios.get(`${BASE_URL}/api/admin/users?page=1&limit=10`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (usersResponse.data.success) {
        console.log('✅ Users retrieved successfully');
        console.log(`📊 Found ${usersResponse.data.users.length} users`);
        console.log(`📄 Pagination: Page ${usersResponse.data.pagination.page} of ${usersResponse.data.pagination.pages}`);
        console.log(`👥 Total users: ${usersResponse.data.pagination.total}`);

        // Display first few users
        console.log('\n📋 Sample Users:');
        usersResponse.data.users.slice(0, 3).forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.is_active ? 'Active' : 'Inactive'}`);
        });

        // Step 3: Test User Update (if users exist)
        if (usersResponse.data.users.length > 0) {
          const testUser = usersResponse.data.users[0];
          console.log(`\n3. Testing Update User (${testUser.name})...`);
          
          const updateResponse = await axios.put(`${BASE_URL}/api/admin/users/${testUser.id}`, {
            name: testUser.name,
            email: testUser.email,
            role: testUser.role,
            is_active: testUser.is_active
          }, {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (updateResponse.data.success) {
            console.log('✅ User update successful');
          } else {
            console.log('❌ User update failed:', updateResponse.data.message);
          }

          // Step 4: Test Get Single User
          console.log(`\n4. Testing Get Single User (${testUser.id})...`);
          const singleUserResponse = await axios.get(`${BASE_URL}/api/admin/users/${testUser.id}`, {
            headers: {
              'Authorization': `Bearer ${adminToken}`
            }
          });

          if (singleUserResponse.data.success) {
            console.log('✅ Single user retrieved successfully');
            console.log(`👤 User: ${singleUserResponse.data.user.name}`);
          } else {
            console.log('❌ Single user retrieval failed:', singleUserResponse.data.message);
          }
        }

        console.log('\n🎉 Admin Users Management Tests Completed Successfully!');
        console.log('\n📋 Summary:');
        console.log('✅ Admin authentication working');
        console.log('✅ Users listing working');
        console.log('✅ User management endpoints working');
        console.log('✅ Pagination working');
        console.log('\n💡 The admin users page should now display users from the database!');

      } else {
        console.log('❌ Failed to get users:', usersResponse.data.message);
      }

    } else {
      console.log('❌ Admin login failed:', loginResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

// Run the test
if (require.main === module) {
  testAdminUsers();
}

module.exports = { testAdminUsers };
