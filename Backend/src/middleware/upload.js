// upload.js - Middleware Multer để upload ảnh
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Fix: prevent uploaded images from being removed after deploy
// Use configurable upload root so production can mount persistent volume.
const uploadRoot = process.env.UPLOAD_ROOT
  ? path.resolve(process.env.UPLOAD_ROOT)
  : path.resolve(process.cwd(), 'uploads');
const uploadDir = path.join(uploadRoot, 'interior-images');

// Guard production from accidentally using ephemeral local storage.
if (
  process.env.NODE_ENV === 'production' &&
  !process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.STRICT_UPLOAD_STORAGE === 'true'
) {
  throw new Error(
    'Local uploads are blocked by STRICT_UPLOAD_STORAGE=true. Configure Cloudinary or a persistent UPLOAD_ROOT.'
  );
}

if (
  process.env.NODE_ENV === 'production' &&
  !process.env.CLOUDINARY_CLOUD_NAME
) {
  console.warn(
    '⚠️  Production is using local uploads. Set CLOUDINARY_* or persistent UPLOAD_ROOT to avoid losing files after deploy.'
  );
}

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique: timestamp + random + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'interior-' + uniqueSuffix + ext);
  }
});

// Filter chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
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
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
