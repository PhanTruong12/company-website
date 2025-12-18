# 🚀 Hướng dẫn Chạy Cả Development và Production

## 📋 Tổng quan

Bạn có thể chạy cả **development** và **production** trên cùng một máy với các cấu hình khác nhau.

## 🔧 Setup

### Bước 1: Tạo các file .env

1. **Tạo `.env.development`** (cho development):
   ```bash
   cd Backend
   cp .env.development.example .env.development
   ```

2. **Tạo `.env.production`** (cho production):
   ```bash
   cp .env.production.example .env.production
   ```

3. **Chỉnh sửa các file .env:**
   - `.env.development` - Cấu hình cho development (localhost, MongoDB local hoặc Atlas dev)
   - `.env.production` - Cấu hình cho production (MongoDB Atlas production, Cloudinary, etc.)

### Bước 2: Cấu hình các file .env

#### `.env.development` (Development):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tndgranite
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key
# Không cần ALLOWED_ORIGINS (tự động cho phép localhost)
```

#### `.env.production` (Production):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tndgranite
PORT=5001
NODE_ENV=production
JWT_SECRET=strong-production-secret-key
ALLOWED_ORIGINS=https://tndgranite-ashy.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Lưu ý:** Đặt PORT khác nhau để chạy cả 2 cùng lúc (ví dụ: dev=5000, prod=5001)

## 🎯 Cách sử dụng

### Chạy Development Server:
```bash
cd Backend
npm run dev
# Hoặc
npm run dev:local
```
- Sử dụng `.env.development`
- Port mặc định: 5000
- Tự động reload với nodemon
- Cho phép tất cả localhost origins

### Chạy Production Server (Local):
```bash
cd Backend
npm run prod:local
```
- Sử dụng `.env.production`
- Port: theo PORT trong `.env.production`
- Không có auto-reload
- Chỉ cho phép origins trong `ALLOWED_ORIGINS`

### Chạy cả 2 cùng lúc:

**Terminal 1 (Development):**
```bash
cd Backend
npm run dev
# Chạy trên http://localhost:5000
```

**Terminal 2 (Production):**
```bash
cd Backend
npm run prod:local
# Chạy trên http://localhost:5001 (hoặc PORT trong .env.production)
```

## 📝 Scripts có sẵn

| Script | Mô tả | Environment |
|--------|-------|-------------|
| `npm run dev` | Development với auto-reload | `.env.development` |
| `npm run dev:local` | Development (tương tự dev) | `.env.development` |
| `npm run prod:local` | Production local | `.env.production` |
| `npm start` | Production (cho deploy) | `.env.production` |

## 🔍 Kiểm tra

### Development:
```bash
# Test API
curl http://localhost:5000/api/stone-types

# Health check
curl http://localhost:5000/health
```

### Production:
```bash
# Test API (thay PORT nếu khác)
curl http://localhost:5001/api/stone-types

# Health check
curl http://localhost:5001/health
```

## ⚠️ Lưu ý quan trọng

1. **Port khác nhau:** Đảm bảo PORT trong `.env.development` và `.env.production` khác nhau
2. **Database:** Có thể dùng cùng MongoDB Atlas hoặc database khác nhau
3. **CORS:** 
   - Development: Tự động cho phép localhost
   - Production: Chỉ cho phép origins trong `ALLOWED_ORIGINS`
4. **JWT Secret:** Production PHẢI dùng secret mạnh hơn
5. **Cloudinary:** Production nên dùng Cloudinary, development có thể dùng local storage

## 🎨 Use Cases

### Case 1: Test Production Config Locally
```bash
# Chạy production mode để test config trước khi deploy
npm run prod:local
```

### Case 2: Development + Production cùng lúc
```bash
# Terminal 1: Development
npm run dev

# Terminal 2: Production
npm run prod:local
```

### Case 3: Chỉ Development
```bash
npm run dev
```

## 🔒 Security

- **Development:** Có thể dùng secret đơn giản, cho phép tất cả localhost
- **Production:** 
  - PHẢI dùng secret mạnh
  - Chỉ cho phép frontend production URL
  - Sử dụng Cloudinary cho image storage

## 📚 Xem thêm

- MongoDB Atlas setup: `QUICK_FIX_MONGODB.md`
- CORS fix: `FIX_CORS.md`
- Railway deployment: `RAILWAY_SETUP.md`

