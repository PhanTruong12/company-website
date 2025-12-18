// testAdmin.js - Script để test admin login
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tndgranite';

async function testAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB');

    // Tìm admin
    const admin = await Admin.findOne({ email: 'admin@tndgranite.com' });
    
    if (!admin) {
      console.log('❌ Không tìm thấy admin trong database');
      console.log('Đang tạo admin mới...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const newAdmin = await Admin.create({
        email: 'admin@tndgranite.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Đã tạo admin mới:', newAdmin.email);
    } else {
      console.log('✅ Tìm thấy admin:', admin.email);
      console.log('  Role:', admin.role);
      console.log('  Password hash:', admin.password.substring(0, 20) + '...');
      
      // Test password
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, admin.password);
      console.log('  Test password "admin123":', isValid ? '✅ Đúng' : '❌ Sai');
      
      if (!isValid) {
        console.log('⚠️  Password không khớp! Đang reset password...');
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash('admin123', salt);
        await admin.save();
        console.log('✅ Đã reset password thành "admin123"');
      }
    }

    // List tất cả admin
    const allAdmins = await Admin.find({});
    console.log('\n📋 Danh sách tất cả admin:');
    allAdmins.forEach((a, index) => {
      console.log(`  ${index + 1}. ${a.email} (${a.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

testAdmin();

