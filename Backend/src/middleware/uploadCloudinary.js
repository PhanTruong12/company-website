// uploadCloudinary.js - Multer storage cho Cloudinary
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
require('dotenv').config();

// Kiểm tra Cloudinary config trước khi sử dụng
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary credentials are missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
}

// Cấu hình Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tndgranite/interior-images', // Folder trên Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      {
        width: 1920,
        height: 1080,
        crop: 'limit', // Giữ tỷ lệ, không crop
        quality: 'auto', // Tự động optimize quality
        fetch_format: 'auto' // Tự động chọn format tốt nhất (WebP nếu browser hỗ trợ)
      }
    ],
    public_id: (req, file) => {
      // Tạo unique ID cho file
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `interior-${uniqueSuffix}`;
    }
  }
});

// Filter chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
  }
};

// Cấu hình multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Giới hạn 10MB (Cloudinary hỗ trợ lớn hơn)
  },
  fileFilter: fileFilter
});

module.exports = upload;