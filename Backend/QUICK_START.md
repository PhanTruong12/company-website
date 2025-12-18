# 🚀 Quick Start - Chạy Local Server

## 📋 Lệnh Chạy Local Development

### Lệnh chính:
```bash
cd Backend
npm run dev
```

Lệnh này sẽ:
- ✅ Load `.env.development` (hoặc `.env` nếu không có)
- ✅ Set `NODE_ENV=development`
- ✅ Chạy với nodemon (tự động reload khi code thay đổi)
- ✅ Cho phép tất cả localhost origins trong CORS
- ✅ Chạy trên port 5000 (hoặc PORT trong .env)

## 🔄 Các Lệnh Khác

### Development với auto-reload:
```bash
npm run dev          # Development mode (recommended)
npm run dev:local    # Tương tự dev
```

### Production local (để test production config):
```bash
npm run prod:local   # Production mode local
```

### Production (cho deploy):
```bash
npm start            # Production mode (cho hosting platforms)
```

## 📝 Setup Lần Đầu

Nếu chưa có file `.env.development`:

```bash
cd Backend

# Tạo file .env.development từ template
npm run create:env:dev

# Chỉnh sửa file .env.development với giá trị thực tế
# Windows: notepad .env.development
# Mac/Linux: nano .env.development

# Generate JWT secret (optional)
npm run generate:jwt-secret

# Test connection (optional)
npm run test:connection

# Chạy server
npm run dev
```

## ✅ Kiểm Tra Server Đã Chạy

Sau khi chạy `npm run dev`, kiểm tra:

1. **Health check:**
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Root endpoint:**
   ```bash
   curl http://localhost:5000/
   # Should return: "Chào mừng đến với API giới thiệu công ty!"
   ```

3. **API endpoint:**
   ```bash
   curl http://localhost:5000/api/stone-types
   # Should return JSON với danh sách loại đá
   ```

4. **Browser:**
   - Mở: `http://localhost:5000/api/stone-types`
   - Should thấy JSON data

## 🛑 Dừng Server

Trong terminal đang chạy server:
- Nhấn `Ctrl + C`

Hoặc kill process:
```bash
# Windows PowerShell
Get-Process -Name node | Where-Object { $_.Path -like "*Backend*" } | Stop-Process

# Mac/Linux
pkill -f "node.*server.js"
```

## 🔍 Troubleshooting

### Port 5000 đã được sử dụng:
```bash
# Tìm process đang dùng port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### MongoDB connection failed:
```bash
# Test connection
npm run test:connection

# Xem hướng dẫn fix
cat QUICK_FIX_MONGODB.md
```

### CORS errors:
- Development tự động cho phép localhost
- Nếu vẫn lỗi, xem `FIX_CORS.md`

## 📚 Xem Thêm

- Environment setup: `ENV_SETUP.md`
- Chạy cả dev và prod: `RUN_BOTH_ENVIRONMENTS.md`
- MongoDB fix: `QUICK_FIX_MONGODB.md`

