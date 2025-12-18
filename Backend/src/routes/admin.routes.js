// admin.routes.js - Routes cho Admin API
// Hỗ trợ cả Cloudinary và Local Storage
const express = require('express');
const router = express.Router();
require('dotenv').config();
const { verifyAdminToken } = require('../middleware/auth.middleware');
const { login, getMe } = require('../controllers/adminAuth.controller');
const {
  createImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage
} = require('../controllers/adminImage.controller');

/**
 * Chọn upload middleware dựa trên cấu hình
 * Nếu có CLOUDINARY_CLOUD_NAME trong .env → dùng Cloudinary
 * Ngược lại → dùng Local Storage
 */
let upload;

// Kiểm tra Cloudinary config và packages
const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME && 
                            process.env.CLOUDINARY_API_KEY && 
                            process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  try {
    // Kiểm tra packages đã được cài đặt chưa
    require.resolve('cloudinary');
    require.resolve('multer-storage-cloudinary');
    
    // Thử require Cloudinary middleware
    upload = require('../middleware/uploadCloudinary');
    console.log('📦 Using Cloudinary for image storage');
  } catch (error) {
    // Nếu thiếu packages hoặc có lỗi, fallback về Local Storage
    console.warn('⚠️  Cloudinary middleware not available, falling back to Local Storage');
    console.warn('   Reason:', error.message);
    console.warn('   Solution: Run "npm install cloudinary multer-storage-cloudinary" to enable Cloudinary');
    upload = require('../middleware/upload');
  }
} else {
  // Không có Cloudinary config, dùng Local Storage
  upload = require('../middleware/upload');
  console.log('📁 Using Local Storage for image storage');
  if (process.env.NODE_ENV === 'development') {
    console.log('   Tip: Add CLOUDINARY_CLOUD_NAME to .env to use Cloudinary');
  }
}

/**
 * Authentication Routes (Public)
 */
router.post('/login', login);
router.get('/me', verifyAdminToken, getMe);

/**
 * Image CRUD Routes (Protected - Admin only)
 * Tất cả routes bên dưới đều được bảo vệ bởi verifyAdminToken middleware
 * Upload middleware tự động chọn Cloudinary hoặc Local Storage
 */
router.post('/images', verifyAdminToken, upload.single('image'), createImage);
router.get('/images', verifyAdminToken, getImages);
router.get('/images/:id', verifyAdminToken, getImageById);
router.put('/images/:id', verifyAdminToken, upload.single('image'), updateImage);
router.delete('/images/:id', verifyAdminToken, deleteImage);

module.exports = router;

