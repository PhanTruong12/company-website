# Backend API - TND Granite

Backend API cho website giới thiệu công ty TND Granite.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cấu hình MongoDB trong file `.env`:
```
MONGODB_URI=mongodb://localhost:27017/tndgranite
PORT=5000
```

## Chạy dự án

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## Seed dữ liệu

Chạy script seed để khởi tạo dữ liệu mẫu (3 loại đá và 3 kiểu nội thất):
```bash
npm run seed
```

## Admin Panel

### Đăng nhập Admin

**URL đăng nhập:**
- **Local Development:** `http://localhost:5000/api/admin/login`
- **Production:** `https://your-backend-url.com/api/admin/login`

**Method:** `POST`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "email": "admin@example.com"
  }
}
```

**Lưu ý:**
- Token JWT sẽ được trả về trong response, sử dụng token này trong header `Authorization: Bearer <token>` cho các request tiếp theo
- Token mặc định có thời hạn 7 ngày (có thể cấu hình qua `JWT_EXPIRES_IN` trong `.env`)
- Tất cả các API admin khác đều yêu cầu authentication token

### Tạo tài khoản Admin

Chạy script để tạo hoặc reset tài khoản admin:
```bash
npm run test:admin
```

Hoặc sử dụng utility script:
```bash
node src/utils/resetAdmin.js
```

## Models

### StoneType (Loại đá)
- Thạch Anh (Quartz)
- Nung Kết (Sintered Stone)
- Tự Nhiên (Natural Stone)

### InteriorType (Kiểu nội thất)
- Bếp (Kitchen)
- Cầu Thang (Stairs)
- Nền Tường-Nhà (Floor-Wall-Home)

### Product (Sản phẩm)
- Kết hợp loại đá và kiểu nội thất
- Bao gồm: hình ảnh, mô tả, giá, thông số kỹ thuật

## Cấu trúc thư mục

```
Backend/
├── src/
│   ├── config/        # Cấu hình database
│   ├── controllers/   # Controllers (sẽ thêm sau)
│   ├── middleware/    # Middleware (sẽ thêm sau)
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes (sẽ thêm sau)
│   └── utils/         # Utilities (seed data)
├── server.js          # Entry point
└── package.json
```

## API Endpoints

### Public Endpoints

- `GET /api/interior-images` - Lấy danh sách hình ảnh nội thất
- `GET /api/stone-types` - Lấy danh sách loại đá
- `GET /api/wall-positions` - Lấy danh sách vị trí tường
- `GET /api/search` - Tìm kiếm sản phẩm
- `GET /health` - Health check endpoint

### Admin Endpoints (Yêu cầu Authentication)

**Authentication:**
- `POST /api/admin/login` - Đăng nhập admin (xem chi tiết ở phần Admin Panel)

**Image Management:**
- `POST /api/admin/images` - Tạo hình ảnh mới (yêu cầu token)
- `GET /api/admin/images` - Lấy danh sách hình ảnh (yêu cầu token)
- `GET /api/admin/images/:id` - Lấy chi tiết hình ảnh (yêu cầu token)
- `PUT /api/admin/images/:id` - Cập nhật hình ảnh (yêu cầu token)
- `DELETE /api/admin/images/:id` - Xóa hình ảnh (yêu cầu token)

**Lưu ý:** Tất cả admin endpoints (trừ `/login`) đều yêu cầu header:
```
Authorization: Bearer <your-jwt-token>
```

