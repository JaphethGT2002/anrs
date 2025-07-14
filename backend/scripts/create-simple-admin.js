/**
 * Simple Admin Creation Script
 * Creates a super admin with predefined credentials
 */

const Admin = require('../models/Admin');
const database = require('../config/mysql-database');

async function createSimpleAdmin() {
  try {
    console.log('🔧 Creating Super Admin Account');
    console.log('===============================\n');

    await database.connect();
    console.log('✅ Database connected\n');

    // Check if super admin already exists
    const stats = await Admin.getStats();
    const superAdminCount = parseInt(stats.super_admins) || 0;
    
    if (superAdminCount > 0) {
      console.log('⚠️  A super admin already exists in the system.');
      console.log('   Current super admins:', superAdminCount);
      await database.close();
      return;
    }

    // Create super admin with default credentials
    const adminData = {
      name: 'Super Admin',
      email: 'admin@anrs.com',
      password: 'admin123456',
      role: 'super_admin'
    };

    console.log('📝 Creating super admin account...');
    console.log(`   Name: ${adminData.name}`);
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Role: ${adminData.role}`);

    const admin = await Admin.create(adminData);

    console.log('\n✅ Super admin created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123456`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);

    console.log('\n🔐 Security Notice:');
    console.log('   Please change the password after first login!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Access admin dashboard: http://localhost:3000/admin/');
    console.log('   3. Login with the credentials above');
    console.log('   4. Change the password in your profile');

    await database.close();

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    await database.close();
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  createSimpleAdmin().catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { createSimpleAdmin };
