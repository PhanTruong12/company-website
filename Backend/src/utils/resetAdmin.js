// resetAdmin.js - Script để reset admin account
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tndgranite';

async function resetAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB');

    // Xóa admin cũ nếu có
    await Admin.deleteOne({ email: 'admin@tndgranite.com' });
    console.log('✅ Đã xóa admin cũ (nếu có)');

    // Tạo admin mới với password plain text
    // Pre-save hook sẽ tự động hash
    const admin = new Admin({
      email: 'admin@tndgranite.com',
      password: 'admin123', // Plain text - sẽ được hash bởi pre-save hook
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Đã tạo admin mới thành công!');
    console.log('');
    console.log('Thông tin đăng nhập:');
    console.log('  Email: admin@tndgranite.com');
    console.log('  Password: admin123');
    console.log('  Password hash:', admin.password.substring(0, 30) + '...');
    console.log('');

    // Test password
    const testPassword = await admin.comparePassword('admin123');
    console.log('Test password "admin123":', testPassword ? '✅ Đúng' : '❌ Sai');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

resetAdmin();

