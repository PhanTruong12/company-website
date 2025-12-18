# Hướng Dẫn Tích Hợp Cloudinary - TND Granite

Hướng dẫn chi tiết cách tích hợp Cloudinary để lưu trữ hình ảnh thay vì lưu local filesystem.

## 📋 Mục Lục

1. [Giới Thiệu Cloudinary](#giới-thiệu-cloudinary)
2. [Tạo Tài Khoản Cloudinary](#tạo-tài-khoản-cloudinary)
3. [Cài Đặt & Cấu Hình](#cài-đặt--cấu-hình)
4. [Tích Hợp Vào Backend](#tích-hợp-vào-backend)
5. [Migrate Hình Ảnh Hiện Tại](#migrate-hình-ảnh-hiện-tại)
6. [So Sánh Với Local Storage](#so-sánh-với-local-storage)

---

## 🌟 Giới Thiệu Cloudinary

### Lợi ích:
- ✅ **CDN tự động** - Hình ảnh load nhanh từ mọi nơi
- ✅ **Image optimization** - Tự động optimize kích thước, format
- ✅ **Transformations** - Resize, crop, watermark trên-the-fly
- ✅ **Free tier** - 25GB storage, 25GB bandwidth/tháng
- ✅ **Không cần quản lý server** - Không lo về disk space
- ✅ **Backup tự động** - Cloudinary tự động backup

### Khi nào nên dùng Cloudinary:
- ✅ Deploy lên serverless (Vercel, Netlify, Railway)
- ✅ Cần CDN cho hình ảnh
- ✅ Cần optimize hình ảnh tự động
- ✅ Không muốn quản lý file storage

---

## 🚀 Tạo Tài Khoản Cloudinary

### Bước 1: Đăng ký
1. Truy cập: https://cloudinary.com
2. Click **"Sign Up for Free"**
3. Điền thông tin:
   - Email
   - Password
   - Full Name
4. Click **"Create Account"**

### Bước 2: Xác thực Email
- Kiểm tra email và click link xác thực

### Bước 3: Lấy Credentials
1. Sau khi đăng nhập, vào **Dashboard**
2. Copy các thông tin sau:
   - **Cloud Name**: `your-cloud-name`
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz`

⚠️ **Lưu ý**: Giữ bí mật API Secret!

---

## 📦 Cài Đặt & Cấu Hình

### Bước 1: Cài đặt package
```bash
cd Backend
npm install cloudinary multer-storage-cloudinary
```

### Bước 2: Cấu hình .env
Thêm vào `Backend/.env`:
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

---

## 🔧 Tích Hợp Vào Backend

### Bước 1: Tạo Cloudinary Config

Tạo file `Backend/src/config/cloudinary.js`:

```javascript
// cloudinary.js - Cấu hình Cloudinary
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Sử dụng HTTPS
});

module.exports = cloudinary;
```

### Bước 2: Tạo Upload Middleware với Cloudinary

Tạo file `Backend/src/middleware/uploadCloudinary.js`:

```javascript
// uploadCloudinary.js - Multer storage cho Cloudinary
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

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
```

### Bước 3: Cập nhật Controller

Cập nhật `Backend/src/controllers/adminImage.controller.js`:

```javascript
// adminImage.controller.js - Controller với Cloudinary
const InteriorImage = require('../models/InteriorImage');

/**
 * Tạo hình ảnh mới (Admin only)
 * POST /api/admin/images
 */
const createImage = async (req, res) => {
  try {
    const { name, stoneType, wallPosition, description } = req.body;

    if (!name || !stoneType || !wallPosition) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: name, stoneType, wallPosition'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng upload hình ảnh'
      });
    }

    // Cloudinary trả về URL trong req.file.secure_url hoặc req.file.url
    const imageUrl = req.file.secure_url || req.file.url;

    // Tạo document mới
    const interiorImage = new InteriorImage({
      name,
      stoneType,
      wallPosition,
      description: description || '',
      imageUrl // Lưu Cloudinary URL thay vì local path
    });

    await interiorImage.save();

    res.status(201).json({
      success: true,
      message: 'Thêm hình ảnh thành công',
      data: interiorImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Xóa hình ảnh (Admin only)
 * DELETE /api/admin/images/:id
 */
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm hình ảnh
    const interiorImage = await InteriorImage.findById(id);
    if (!interiorImage) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hình ảnh'
      });
    }

    // Xóa từ Cloudinary
    if (interiorImage.imageUrl && interiorImage.imageUrl.includes('cloudinary.com')) {
      const cloudinary = require('../config/cloudinary');
      // Extract public_id từ URL
      const urlParts = interiorImage.imageUrl.split('/');
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExt.split('.')[0];
      const folder = 'tndgranite/interior-images';
      
      try {
        await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Tiếp tục xóa document dù Cloudinary có lỗi
      }
    }

    // Xóa document
    await InteriorImage.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Xóa hình ảnh thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

module.exports = {
  createImage,
  deleteImage,
  // ... các functions khác
};
```

### Bước 4: Cập nhật Routes

Cập nhật `Backend/src/routes/admin.routes.js`:

```javascript
// admin.routes.js
const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/auth.middleware');
const { createImage, getImages, getImageById, updateImage, deleteImage } = require('../controllers/adminImage.controller');

// Import Cloudinary upload thay vì local upload
const upload = require('../middleware/uploadCloudinary');

// Routes
router.post('/images', verifyAdminToken, upload.single('image'), createImage);
router.get('/images', verifyAdminToken, getImages);
router.get('/images/:id', verifyAdminToken, getImageById);
router.put('/images/:id', verifyAdminToken, updateImage);
router.delete('/images/:id', verifyAdminToken, deleteImage);

module.exports = router;
```

### Bước 5: Cập nhật Server.js

Đảm bảo không cần serve static files từ `/uploads` nữa (hoặc giữ lại cho backward compatibility):

```javascript
// server.js
// Có thể bỏ dòng này nếu không còn dùng local storage
// app.use('/uploads', express.static('uploads'));
```

---

## 📤 Migrate Hình Ảnh Hiện Tại Lên Cloudinary

### Option 1: Sử dụng Cloudinary Upload API

Script `Backend/src/utils/migrateToCloudinary.js` đã được tạo với đầy đủ tính năng:

**Tính năng chính:**
- ✅ Kiểm tra Cloudinary configuration
- ✅ Tự động phát hiện hình ảnh đã có trên Cloudinary (skip)
- ✅ Upload với transformations (auto optimize)
- ✅ Cập nhật URL và `cloudinaryPublicId` trong database
- ✅ Dry run mode để test trước
- ✅ Xóa file local (optional)
- ✅ Progress tracking và error reporting
- ✅ Hỗ trợ limit và skip

**Xem code đầy đủ trong:** `Backend/src/utils/migrateToCloudinary.js`

Scripts đã được thêm vào `Backend/package.json`:
```json
{
  "scripts": {
    "migrate:cloudinary": "node src/utils/migrateToCloudinary.js",
    "migrate:cloudinary:dry": "node src/utils/migrateToCloudinary.js --dry-run"
  }
}
```

### Cách sử dụng:

**1. Dry Run (Khuyến nghị - Test trước):**
```bash
cd Backend
npm run migrate:cloudinary:dry
```
Xem trước những gì sẽ được migrate, không thay đổi gì.

**2. Migrate thực tế:**
```bash
cd Backend
npm run migrate:cloudinary
```
Upload tất cả hình ảnh lên Cloudinary và cập nhật database.

**3. Migrate và xóa file local (Cẩn thận!):**
```bash
node src/utils/migrateToCloudinary.js --delete-local
```
⚠️ Chỉ dùng sau khi đã verify hình ảnh trên Cloudinary hoạt động tốt.

**4. Migrate một số hình ảnh nhất định:**
```bash
# Migrate 10 hình ảnh đầu tiên
node src/utils/migrateToCloudinary.js --limit=10

# Skip 5 hình đầu, migrate 10 hình tiếp theo
node src/utils/migrateToCloudinary.js --skip=5 --limit=10
```

### Các tùy chọn:

| Option | Mô tả | Ví dụ |
|--------|-------|-------|
| `--dry-run` hoặc `-d` | Test migration không thay đổi | `--dry-run` |
| `--delete-local` hoặc `-dl` | Xóa file local sau khi upload | `--delete-local` |
| `--limit=N` | Giới hạn số hình ảnh migrate | `--limit=10` |
| `--skip=N` | Bỏ qua N hình ảnh đầu tiên | `--skip=5` |

### Option 2: Sử dụng Cloudinary Dashboard
1. Vào Cloudinary Dashboard
2. Click **"Media Library"**
3. Click **"Upload"**
4. Upload từng file hoặc folder

---

## 🔄 So Sánh Với Local Storage

| Tính năng | Local Storage | Cloudinary |
|-----------|---------------|------------|
| **Setup** | Dễ | Cần tài khoản |
| **Cost** | Free | Free tier 25GB |
| **CDN** | ❌ | ✅ Tự động |
| **Optimization** | ❌ Manual | ✅ Tự động |
| **Transformations** | ❌ | ✅ On-the-fly |
| **Backup** | ❌ Manual | ✅ Tự động |
| **Scalability** | ❌ Limited | ✅ Unlimited |
| **Serverless** | ❌ | ✅ Compatible |

---

## 🎯 Best Practices

### 1. Sử dụng Transformations
```javascript
// Trong frontend, có thể transform hình ảnh:
// Original: https://res.cloudinary.com/cloud/image/upload/v123/interior-1.jpg
// Thumbnail: https://res.cloudinary.com/cloud/image/upload/w_300,h_300,c_fill/v123/interior-1.jpg
// Optimized: https://res.cloudinary.com/cloud/image/upload/q_auto,f_auto/v123/interior-1.jpg
```

### 2. Lưu public_id trong database
Có thể lưu thêm `publicId` để dễ dàng xóa sau này:
```javascript
const interiorImage = new InteriorImage({
  // ...
  imageUrl: req.file.secure_url,
  cloudinaryPublicId: req.file.public_id // Lưu để dễ xóa
});
```

### 3. Sử dụng Folder Structure
```
tndgranite/
  ├── interior-images/
  ├── thumbnails/
  └── products/
```

### 4. Monitor Usage
- Vào Cloudinary Dashboard → Usage
- Monitor storage và bandwidth
- Set up alerts nếu cần

---

## ✅ Checklist

- [ ] Đã tạo tài khoản Cloudinary
- [ ] Đã lấy Cloud Name, API Key, API Secret
- [ ] Đã cài đặt packages
- [ ] Đã cấu hình .env
- [ ] Đã tạo uploadCloudinary.js
- [ ] Đã cập nhật controller
- [ ] Đã cập nhật routes
- [ ] Đã test upload hình ảnh mới
- [ ] Đã migrate hình ảnh cũ (nếu có)
- [ ] Đã test xóa hình ảnh
- [ ] Đã verify hình ảnh hiển thị trên frontend

---

## 🐛 Troubleshooting

### Lỗi: "Invalid API Key"
- Kiểm tra API Key và API Secret trong .env
- Đảm bảo không có khoảng trắng thừa

### Lỗi: "Upload failed"
- Kiểm tra file size (max 10MB cho free tier)
- Kiểm tra file format (chỉ jpg, png, gif, webp)
- Kiểm tra internet connection

### Hình ảnh không hiển thị
- Kiểm tra URL trong database
- Kiểm tra CORS settings trên Cloudinary (nếu cần)
- Kiểm tra browser console

---

## 📚 Tài Liệu Tham Khảo

- **Cloudinary Documentation**: https://cloudinary.com/documentation
- **Node.js SDK**: https://cloudinary.com/documentation/node_integration
- **Image Transformations**: https://cloudinary.com/documentation/image_transformations

---

**Chúc bạn tích hợp Cloudinary thành công! 🚀**

