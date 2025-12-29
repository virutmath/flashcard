/**
 * Script to create default admin user
 */
require('dotenv').config();
const { initializeDatabase, getDatabase } = require('../src/config/database');
const AdminUser = require('../src/models/AdminUser');

async function createDefaultAdmin() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('✓ Database initialized');

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = AdminUser.getByUsername('admin');
    if (existingAdmin) {
      console.log('✓ Default admin user already exists');
      process.exit(0);
    }

    // Tạo tài khoản admin mặc định
    console.log('Creating default admin user...');
    const admin = AdminUser.create('admin', 'admin123', 'admin');
    console.log('✓ Default admin user created successfully');
    console.log(`  Username: admin`);
    console.log(`  Password: admin123`);
    console.log(`  ID: ${admin.id}`);
    console.log(`  Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createDefaultAdmin();
