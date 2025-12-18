# Test Checklist - TND Granite Website

Checklist để test kỹ ứng dụng ở môi trường development trước khi deploy.

## 🚀 Khởi động ứng dụng

### Backend
```bash
cd Backend
npm install
npm run dev
```
✅ Backend chạy trên: http://localhost:5000
✅ Console hiển thị: "Server đang chạy trên cổng: 5000"
✅ MongoDB Connected: ...

### Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend chạy trên: http://localhost:5173
✅ Không có lỗi trong console

---

## 📋 Test Checklist

### 1. Backend API Tests

#### 1.1. Health Check
- [ ] GET http://localhost:5000/
  - Kỳ vọng: "Chào mừng đến với API giới thiệu công ty!"

#### 1.2. Stone Types API
- [ ] GET http://localhost:5000/api/stone-types
  - Kỳ vọng: Trả về danh sách loại đá (Thạch Anh, Nung Kết, Tự Nhiên, etc.)
  - Status: 200
  - Response có structure: `{ success: true, data: [...] }`

#### 1.3. Wall Positions API
- [ ] GET http://localhost:5000/api/wall-positions
  - Kỳ vọng: Trả về danh sách vị trí ốp
  - Status: 200

#### 1.4. Interior Images API
- [ ] GET http://localhost:5000/api/interior-images
  - Kỳ vọng: Trả về danh sách hình ảnh
  - Status: 200
  - Có thể filter: `?stoneType=Thạch Anh&wallPosition=...`

- [ ] GET http://localhost:5000/api/interior-images/:id
  - Kỳ vọng: Trả về chi tiết 1 hình ảnh
  - Status: 200

#### 1.5. Search API
- [ ] GET http://localhost:5000/api/search?q=thạch anh
  - Kỳ vọng: Trả về kết quả tìm kiếm
  - Status: 200

#### 1.6. Admin Authentication API
- [ ] POST http://localhost:5000/api/admin/login
  - Body: `{ "email": "admin@tndgranite.com", "password": "admin123" }`
  - Kỳ vọng: Trả về token và thông tin admin
  - Status: 200
  - Response có: `{ success: true, token: "...", admin: {...} }`

- [ ] GET http://localhost:5000/api/admin/me
  - Header: `Authorization: Bearer <token>`
  - Kỳ vọng: Trả về thông tin admin hiện tại
  - Status: 200

#### 1.7. Admin Images CRUD API
- [ ] GET http://localhost:5000/api/admin/images
  - Header: `Authorization: Bearer <token>`
  - Kỳ vọng: Trả về danh sách hình ảnh (admin)
  - Status: 200

- [ ] POST http://localhost:5000/api/admin/images
  - Header: `Authorization: Bearer <token>`
  - FormData: `{ name, stoneType, wallPosition, description, image }`
  - Kỳ vọng: Tạo hình ảnh mới thành công
  - Status: 201

- [ ] PUT http://localhost:5000/api/admin/images/:id
  - Header: `Authorization: Bearer <token>`
  - Body: `{ name, stoneType, wallPosition, description }`
  - Kỳ vọng: Cập nhật hình ảnh thành công
  - Status: 200

- [ ] DELETE http://localhost:5000/api/admin/images/:id
  - Header: `Authorization: Bearer <token>`
  - Kỳ vọng: Xóa hình ảnh thành công
  - Status: 200

#### 1.8. Static Files
- [ ] GET http://localhost:5000/uploads/interior-images/...
  - Kỳ vọng: Hiển thị hình ảnh
  - Status: 200
  - Content-Type: image/jpeg hoặc image/png

---

### 2. Frontend Tests

#### 2.1. Trang Chủ (Home)
- [ ] Truy cập: http://localhost:5173/
- [ ] Logo hiển thị đúng
- [ ] Thông tin công ty hiển thị
- [ ] Nút gọi điện hoạt động
- [ ] Icon Facebook hoạt động
- [ ] Bộ sưu tập hiển thị
- [ ] Gallery section hiển thị
- [ ] Usage section hiển thị
- [ ] Footer hiển thị đầy đủ
- [ ] Responsive trên mobile

#### 2.2. Trang Giới Thiệu (About)
- [ ] Truy cập: http://localhost:5173/about
- [ ] H1 hiển thị đúng
- [ ] Hình ảnh hiển thị
- [ ] Nội dung đầy đủ các sections
- [ ] Typography đẹp, dễ đọc
- [ ] Responsive

#### 2.3. Trang Liên Hệ (Contact)
- [ ] Truy cập: http://localhost:5173/contact
- [ ] Thông tin liên hệ hiển thị đúng
- [ ] Google Maps hiển thị
- [ ] Form liên hệ hoạt động
- [ ] Validation form hoạt động
- [ ] CTA buttons hoạt động (Gọi điện, Zalo)
- [ ] Responsive

#### 2.4. Trang Showroom
- [ ] Truy cập: http://localhost:5173/showroom
- [ ] Danh sách hình ảnh hiển thị
- [ ] Filter theo Stone Type hoạt động
- [ ] Filter theo Wall Position hoạt động
- [ ] Hình ảnh load đúng
- [ ] Click vào hình ảnh mở detail page
- [ ] Responsive

#### 2.5. Trang Showroom Detail
- [ ] Truy cập: http://localhost:5173/showroom/:slug
- [ ] Chi tiết hình ảnh hiển thị
- [ ] Thông tin đầy đủ (name, stoneType, wallPosition, description)
- [ ] Hình ảnh hiển thị đúng
- [ ] Nút quay lại hoạt động
- [ ] Responsive

#### 2.6. Search Functionality
- [ ] Search bar hiển thị trong header
- [ ] Gõ từ khóa → hiển thị kết quả
- [ ] Click vào kết quả → chuyển đến detail page
- [ ] Debounce hoạt động (không gọi API quá nhiều)
- [ ] Empty state hiển thị khi không có kết quả

#### 2.7. Navigation
- [ ] Header navigation hoạt động
- [ ] Logo click → về trang chủ
- [ ] Menu items hoạt động
- [ ] Showroom dropdown hoạt động
- [ ] Active state hiển thị đúng
- [ ] Mobile menu (nếu có)

#### 2.8. Collection Redirect
- [ ] Truy cập: http://localhost:5173/collection/thach-anh
- [ ] Tự động redirect đến /showroom?stoneType=Thạch Anh
- [ ] Filter được áp dụng đúng
- [ ] Data load đúng

---

### 3. Admin Panel Tests

#### 3.1. Admin Login
- [ ] Truy cập: http://localhost:5173/internal/admin/login
- [ ] Form login hiển thị
- [ ] Nhập email/password sai → hiển thị lỗi
- [ ] Nhập đúng → đăng nhập thành công
- [ ] Token được lưu vào localStorage
- [ ] Redirect đến /internal/admin/images

#### 3.2. Admin Guard
- [ ] Chưa đăng nhập → truy cập /internal/admin/images
- [ ] Tự động redirect đến /internal/admin/login
- [ ] Đã đăng nhập → truy cập được

#### 3.3. Admin Images Management
- [ ] Truy cập: http://localhost:5173/internal/admin/images
- [ ] Danh sách hình ảnh hiển thị
- [ ] Grid layout đẹp
- [ ] Hình ảnh hiển thị đúng

#### 3.4. Add New Image
- [ ] Click "Thêm hình ảnh"
- [ ] Modal form hiển thị
- [ ] Upload hình ảnh → preview hiển thị
- [ ] Điền đầy đủ thông tin
- [ ] Submit → tạo thành công
- [ ] Danh sách cập nhật ngay

#### 3.5. Edit Image
- [ ] Click "Sửa" trên một hình ảnh
- [ ] Modal form hiển thị với data cũ
- [ ] Sửa thông tin
- [ ] Submit → cập nhật thành công
- [ ] Danh sách cập nhật

#### 3.6. Delete Image
- [ ] Click "Xóa" trên một hình ảnh
- [ ] Confirm dialog hiển thị
- [ ] Confirm → xóa thành công
- [ ] Danh sách cập nhật

#### 3.7. Admin Logout
- [ ] Click logout
- [ ] Token bị xóa khỏi localStorage
- [ ] Redirect đến login page

---

### 4. Error Handling Tests

#### 4.1. Backend Errors
- [ ] API không tồn tại → 404
- [ ] Thiếu token → 401
- [ ] Token không hợp lệ → 401
- [ ] Validation errors → 400
- [ ] Server errors → 500

#### 4.2. Frontend Errors
- [ ] Backend không chạy → hiển thị lỗi kết nối
- [ ] API lỗi → hiển thị thông báo lỗi
- [ ] Hình ảnh không load → hiển thị placeholder
- [ ] Form validation → hiển thị lỗi rõ ràng

---

### 5. Performance Tests

#### 5.1. Load Time
- [ ] Trang chủ load < 3s
- [ ] Showroom load < 2s
- [ ] API response < 1s

#### 5.2. Image Loading
- [ ] Hình ảnh lazy load
- [ ] Hình ảnh optimize (kích thước hợp lý)
- [ ] Không bị layout shift

#### 5.3. Bundle Size
- [ ] Frontend bundle < 500KB (gzipped)
- [ ] Không có dependencies không cần thiết

---

### 6. Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

### 7. Responsive Design

#### 7.1. Desktop (1920px+)
- [ ] Layout đẹp, không bị quá rộng
- [ ] Typography dễ đọc

#### 7.2. Tablet (768px - 1024px)
- [ ] Layout responsive
- [ ] Menu hoạt động tốt
- [ ] Images hiển thị đúng

#### 7.3. Mobile (< 768px)
- [ ] Layout stack đúng
- [ ] Touch targets đủ lớn
- [ ] Menu mobile hoạt động
- [ ] Text dễ đọc
- [ ] Forms dễ sử dụng

---

### 8. Security Tests

#### 8.1. Authentication
- [ ] Không thể truy cập admin routes khi chưa login
- [ ] Token expire sau 7 ngày
- [ ] Password được hash trong database

#### 8.2. Input Validation
- [ ] SQL injection không hoạt động
- [ ] XSS không hoạt động
- [ ] File upload chỉ chấp nhận images
- [ ] File size limit hoạt động

#### 8.3. CORS
- [ ] CORS được cấu hình đúng
- [ ] Chỉ frontend domain được phép

---

## 🐛 Common Issues & Solutions

### Backend không kết nối MongoDB
- Kiểm tra MongoDB đang chạy
- Kiểm tra MONGODB_URI trong .env
- Kiểm tra network/firewall

### Frontend không gọi được API
- Kiểm tra backend đang chạy
- Kiểm tra CORS
- Kiểm tra VITE_API_BASE_URL
- Kiểm tra network tab trong DevTools

### Hình ảnh không hiển thị
- Kiểm tra đường dẫn /uploads
- Kiểm tra file tồn tại trong uploads/interior-images
- Kiểm tra CORS cho static files

### Admin không đăng nhập được
- Kiểm tra đã seed admin account chưa
- Kiểm tra password đúng chưa
- Kiểm tra JWT_SECRET trong .env
- Kiểm tra logs backend

---

## ✅ Test Results

**Ngày test:** _______________
**Tester:** _______________

### Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Skipped: ___

### Notes
_________________________________________________
_________________________________________________
_________________________________________________

---

## 📝 Next Steps

Sau khi test xong:
1. Fix các bugs phát hiện
2. Test lại các phần đã fix
3. Chuẩn bị deploy lên production
4. Test lại trên production environment

