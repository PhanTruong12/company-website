# Cloudinary Integration Checklist

Checklist để tích hợp Cloudinary theo hướng dẫn trong `CLOUDINARY_SETUP.md`.

## ✅ Checklist

### Bước 1: Tạo Tài Khoản Cloudinary
- [ ] Đã đăng ký tài khoản tại https://cloudinary.com
- [ ] Đã xác thực email
- [ ] Đã lấy Cloud Name, API Key, API Secret từ Dashboard

### Bước 2: Cài Đặt Packages
- [ ] Đã chạy: `cd Backend && npm install cloudinary multer-storage-cloudinary`
- [ ] Packages đã được thêm vào `package.json` ✅ (Đã tự động thêm)

### Bước 3: Cấu Hình .env
- [ ] Đã tạo file `.env` trong thư mục `Backend/`
- [ ] Đã thêm các biến môi trường:
  ```env
  CLOUDINARY_CLOUD_NAME=your-cloud-name
  CLOUDINARY_API_KEY=your-api-key
  CLOUDINARY_API_SECRET=your-api-secret
  ```
- [ ] Đã verify không có khoảng trắng thừa

### Bước 4: Kiểm Tra Files Đã Tạo
- [ ] ✅ `Backend/src/config/cloudinary.js` - Đã tạo
- [ ] ✅ `Backend/src/middleware/uploadCloudinary.js` - Đã tạo
- [ ] ✅ `Backend/src/controllers/adminImage.controller.js` - Đã cập nhật
- [ ] ✅ `Backend/src/routes/admin.routes.js` - Đã cập nhật với auto-detect
- [ ] ✅ `Backend/src/models/InteriorImage.js` - Đã thêm `cloudinaryPublicId`
- [ ] ✅ `Backend/src/utils/migrateToCloudinary.js` - Đã tạo

### Bước 5: Test Upload
- [ ] Đã khởi động backend: `npm run dev`
- [ ] Console hiển thị: "📦 Using Cloudinary for image storage"
- [ ] Đã test upload hình ảnh mới qua admin panel
- [ ] Hình ảnh được lưu lên Cloudinary (URL chứa `cloudinary.com`)
- [ ] Hình ảnh hiển thị đúng trên frontend

### Bước 6: Migrate Hình Ảnh Cũ (Nếu có)
- [ ] Đã chạy dry run: `npm run migrate:cloudinary:dry`
- [ ] Đã review kết quả dry run
- [ ] Đã chạy migration thực tế: `npm run migrate:cloudinary`
- [ ] Đã verify hình ảnh cũ hiển thị đúng sau khi migrate
- [ ] (Optional) Đã xóa file local sau khi verify

### Bước 7: Test CRUD Operations
- [ ] ✅ Create - Upload hình ảnh mới
- [ ] ✅ Read - Xem danh sách hình ảnh
- [ ] ✅ Update - Cập nhật hình ảnh (có upload ảnh mới)
- [ ] ✅ Delete - Xóa hình ảnh (xóa cả trên Cloudinary)

### Bước 8: Verify Production Ready
- [ ] Đã test trên môi trường development
- [ ] Đã verify hình ảnh load nhanh từ CDN
- [ ] Đã kiểm tra Cloudinary Dashboard → Usage
- [ ] Đã setup monitoring/alerts (nếu cần)

---

## 🚀 Quick Start Commands

### 1. Cài đặt packages:
```bash
cd Backend
npm install cloudinary multer-storage-cloudinary
```

### 2. Cấu hình .env:
Thêm vào `Backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Test upload:
```bash
npm run dev
# Console sẽ hiển thị: "📦 Using Cloudinary for image storage"
```

### 4. Migrate hình ảnh cũ:
```bash
# Dry run trước
npm run migrate:cloudinary:dry

# Migrate thực tế
npm run migrate:cloudinary
```

---

## 📝 Notes

- **Auto-detect**: Routes tự động chọn Cloudinary hoặc Local Storage dựa trên `.env`
- **Backward Compatible**: Hỗ trợ cả hình ảnh cũ (local) và mới (Cloudinary)
- **No Breaking Changes**: Có thể switch giữa Cloudinary và Local Storage bất cứ lúc nào

---

## ❓ Troubleshooting

Nếu gặp lỗi, xem phần Troubleshooting trong `CLOUDINARY_SETUP.md`.

---

**Status**: Tất cả code đã sẵn sàng! Chỉ cần:
1. Cài đặt packages: `npm install`
2. Cấu hình `.env` với Cloudinary credentials
3. Restart server và test!

