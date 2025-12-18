# Quick Test Guide - TND Granite Website

Hướng dẫn test nhanh ứng dụng trong môi trường development.

## 🚀 Khởi động nhanh

### Terminal 1 - Backend
```bash
cd Backend
npm install
npm run dev
```
✅ Kiểm tra: http://localhost:5000 → "Chào mừng đến với API giới thiệu công ty!"

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Kiểm tra: http://localhost:5173 → Trang chủ hiển thị

---

## ⚡ Test nhanh (5 phút)

### 1. Test Backend API (2 phút)

#### Option A: Dùng script tự động
```bash
cd Backend
npm run test:api
```

#### Option B: Test thủ công với curl/Postman

**Health Check:**
```bash
curl http://localhost:5000/
```

**Stone Types:**
```bash
curl http://localhost:5000/api/stone-types
```

**Interior Images:**
```bash
curl http://localhost:5000/api/interior-images
```

**Admin Login:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tndgranite.com","password":"admin123"}'
```

### 2. Test Frontend (3 phút)

Mở trình duyệt và kiểm tra:

1. **Trang Chủ** (http://localhost:5173/)
   - [ ] Logo hiển thị
   - [ ] Bộ sưu tập hiển thị
   - [ ] Footer hiển thị

2. **Showroom** (http://localhost:5173/showroom)
   - [ ] Hình ảnh hiển thị
   - [ ] Filter hoạt động
   - [ ] Click vào hình → mở detail

3. **Admin Login** (http://localhost:5173/internal/admin/login)
   - [ ] Form hiển thị
   - [ ] Đăng nhập với: `admin@tndgranite.com` / `admin123`
   - [ ] Sau khi login → vào được admin panel

4. **Admin Panel** (http://localhost:5173/internal/admin/images)
   - [ ] Danh sách hình ảnh hiển thị
   - [ ] Thêm hình ảnh mới
   - [ ] Sửa hình ảnh
   - [ ] Xóa hình ảnh

---

## 🔍 Kiểm tra Console

### Backend Console
- ✅ "Server đang chạy trên cổng: 5000"
- ✅ "MongoDB Connected: ..."
- ❌ Không có lỗi đỏ

### Frontend Console (F12)
- ✅ Không có lỗi đỏ
- ✅ API calls thành công (200)
- ❌ Không có CORS errors
- ❌ Không có 404 errors

---

## 🐛 Nếu có lỗi

### Backend không chạy
```bash
# Kiểm tra MongoDB đang chạy
# Kiểm tra PORT 5000 đã được sử dụng chưa
# Kiểm tra file .env có đúng không
```

### Frontend không gọi được API
```bash
# Kiểm tra backend đang chạy
# Kiểm tra VITE_API_BASE_URL trong .env
# Kiểm tra CORS trên backend
```

### Admin không đăng nhập được
```bash
cd Backend
npm run seed
# Hoặc
node src/utils/resetAdmin.js
```

---

## ✅ Checklist hoàn thành

- [ ] Backend chạy OK
- [ ] Frontend chạy OK
- [ ] API endpoints hoạt động
- [ ] Trang chủ hiển thị đúng
- [ ] Showroom hiển thị hình ảnh
- [ ] Admin login thành công
- [ ] CRUD hình ảnh hoạt động
- [ ] Không có lỗi trong console

**Nếu tất cả đều OK → Sẵn sàng deploy! 🚀**

Xem chi tiết trong file `TEST_CHECKLIST.md` để test kỹ hơn.

