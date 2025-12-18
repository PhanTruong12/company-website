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

(Sẽ được thêm sau khi tạo controllers và routes)

