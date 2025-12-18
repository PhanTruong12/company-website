// cloudinary.js - Cấu hình Cloudinary
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Chỉ config Cloudinary nếu có đầy đủ credentials
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true // Sử dụng HTTPS
    });
    console.log('✅ Cloudinary configured successfully');
  } catch (error) {
    console.error('❌ Cloudinary configuration error:', error.message);
    if (error.message.includes('authentication') || error.message.includes('bad auth')) {
      console.error('   Please check your Cloudinary credentials:');
      console.error('   1. CLOUDINARY_CLOUD_NAME is correct');
      console.error('   2. CLOUDINARY_API_KEY is correct');
      console.error('   3. CLOUDINARY_API_SECRET is correct');
    }
  }
}

module.exports = cloudinary;