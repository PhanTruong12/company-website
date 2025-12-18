# Railway Nixpacks Configuration

Hướng dẫn cấu hình Railway sử dụng Nixpacks builder.

## 📋 Files Cấu Hình

### 1. `nixpacks.toml`
File này chỉ định cách Nixpacks build project:
- Node.js version: 18
- Build command: `npm install`
- Start command: `npm start`

### 2. `.nvmrc` và `.node-version`
Chỉ định Node.js version 18 cho Nixpacks detect.

### 3. `railway.json`
Cấu hình Railway sử dụng Nixpacks builder.

## ⚙️ Cấu Hình Trên Railway Dashboard

### Bước 1: Chọn Builder
1. Vào Railway Dashboard → Project → Service
2. **Settings** → **Service**
3. **Builder**: Chọn **Nixpacks** ⭐
4. Save

### Bước 2: Kiểm tra Root Directory
1. **Settings** → **Service**
2. **Root Directory**: `Backend` ⭐ (Quan trọng!)
3. Save

### Bước 3: Build Settings (Optional)
Nixpacks sẽ tự động detect từ `nixpacks.toml`, nhưng có thể override:
- **Build Command**: `npm install` (hoặc để mặc định)
- **Start Command**: `npm start` (hoặc để mặc định)

## 🚀 Deploy

Sau khi cấu hình:
1. Commit và push code lên GitHub
2. Railway sẽ tự động detect Nixpacks
3. Build sẽ sử dụng `nixpacks.toml`
4. Deploy tự động

## ✅ Kiểm Tra

Sau khi deploy:
- Build logs không có lỗi
- Service status: Running
- Health check: `https://your-app.railway.app/` → OK

## 🔄 Nếu Cần Đổi Builder

### Từ Dockerfile sang Nixpacks:
1. **Settings** → **Service** → **Builder**: `Nixpacks`
2. Xóa hoặc rename `Dockerfile` (nếu không dùng)

### Từ Nixpacks sang Dockerfile:
1. **Settings** → **Service** → **Builder**: `Dockerfile`
2. Đảm bảo `Dockerfile` tồn tại trong `Backend/`

---

**Nixpacks là builder mặc định và được khuyến nghị cho Node.js projects! 🚀**

