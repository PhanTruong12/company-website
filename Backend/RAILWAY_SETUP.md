# Railway Setup - Quick Guide

## ⚠️ QUAN TRỌNG: Root Directory

**KHÔNG** thêm `rootDirectory` vào file `railway.json` - Railway không hỗ trợ property này trong config file!

Root Directory **PHẢI** được set trên Railway Dashboard.

## ✅ Cách Set Root Directory Trên Railway Dashboard

### Bước 1: Vào Settings
1. Railway Dashboard → **Project** → **Service** (Backend)
2. Click **Settings** tab

### Bước 2: Set Root Directory
1. Scroll xuống phần **Service**
2. Tìm field **Root Directory**
3. Nhập: `Backend` (không có dấu `/` ở đầu)
4. Click **Save**

### Bước 3: Chọn Builder
1. Trong cùng phần **Service**
2. **Builder**: Chọn **Nixpacks**
3. Click **Save**

### Bước 4: Redeploy
- Railway sẽ tự động rebuild sau khi save
- Hoặc click **Redeploy** button

## 📋 Files Cấu Hình

### `Backend/railway.json` (ĐÚNG)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

**Lưu ý:** Railway chỉ hỗ trợ các properties cơ bản trong `railway.json`. Các settings như restart policy phải được cấu hình trên Railway Dashboard.

### ❌ KHÔNG LÀM THẾ NÀY:
```json
{
  "rootDirectory": "Backend"  // ❌ KHÔNG HỖ TRỢ!
}
```

## 🔍 Kiểm Tra

Sau khi set Root Directory trên Dashboard:
1. Vào **Deployments** tab
2. Xem build logs
3. Nếu thành công, bạn sẽ thấy:
   - ✅ "Detected Node.js project"
   - ✅ "Installing dependencies..."
   - ✅ "Build completed"

## 🐛 Nếu Vẫn Lỗi

### Lỗi: "should NOT have additional property `rootDirectory`"
**Nguyên nhân:** File `railway.json` có property `rootDirectory`
**Giải pháp:** 
1. Xóa `rootDirectory` khỏi `railway.json`
2. Set Root Directory trên Dashboard thay vì trong file

### Lỗi: "Nixpacks was unable to generate a build plan"
**Nguyên nhân:** Root Directory chưa được set hoặc sai
**Giải pháp:**
1. Kiểm tra Root Directory = `Backend` trên Dashboard
2. Đảm bảo `Backend/package.json` tồn tại
3. Redeploy

---

**Lưu ý:** Root Directory chỉ có thể set trên Railway Dashboard, không thể set trong config files! 🚀

