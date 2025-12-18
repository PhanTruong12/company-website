# Deploy Quick Start - TND Granite

Hướng dẫn nhanh để deploy ứng dụng lên production.

## 🚀 Quick Deploy (15 phút)

> **Lưu ý:** Nếu repository có cả Backend và Frontend (monorepo), xem `DEPLOY_MONOREPO.md` để biết cách cấu hình Root Directory.

## 🚀 Quick Deploy (15 phút)

### Bước 1: Chuẩn Bị (5 phút)

#### 1.1. MongoDB Atlas
- [ ] Tạo cluster tại https://www.mongodb.com/cloud/atlas
- [ ] Lấy connection string
- [ ] Whitelist IP: `0.0.0.0/0` (hoặc IP server)

#### 1.2. Cloudinary (Optional)
- [ ] Tạo tài khoản tại https://cloudinary.com
- [ ] Lấy Cloud Name, API Key, API Secret

### Bước 2: Deploy Backend (5 phút)

#### Option A: Railway (Khuyến nghị - Dễ nhất)

1. **Đăng ký:** https://railway.app (dùng GitHub login)
2. **New Project** → **Deploy from GitHub**
3. **Chọn repo** → **Chọn thư mục `Backend`**
4. **Settings** → **Variables** → Thêm:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=<tạo chuỗi ngẫu nhiên>
   NODE_ENV=production
   ```
5. **Deploy tự động** → Copy URL (ví dụ: `https://xxx.railway.app`)

#### Option B: Render

1. **Đăng ký:** https://render.com
2. **New** → **Web Service**
3. **Connect GitHub** → Chọn repo
4. **Cấu hình:**
   - Name: `tndgranite-backend`
   - Root Directory: `Backend`
   - Build: `npm install`
   - Start: `npm start`
5. **Environment** → Thêm variables như trên
6. **Create** → Copy URL

### Bước 3: Seed Data (1 phút)

```bash
# Railway: Vào Deployments → View Logs → Shell
npm run seed

# Render: Vào Shell và chạy
npm run seed
```

### Bước 4: Deploy Frontend (4 phút)

#### Option A: Vercel (Khuyến nghị)

1. **Đăng nhập:** https://vercel.com (dùng GitHub)
2. **Add New Project** → Import Git Repository
3. **Cấu hình:**
   - Framework: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables:**
   - `VITE_API_BASE_URL` = `https://your-backend-url.com/api`
5. **Deploy** → Copy URL

#### Option B: Netlify

1. **Đăng nhập:** https://netlify.com
2. **Add new site** → **Import from Git**
3. **Cấu hình:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Environment Variables:**
   - `VITE_API_BASE_URL` = `https://your-backend-url.com/api`
5. **Deploy**

### Bước 5: Update CORS (1 phút)

Cập nhật `ALLOWED_ORIGINS` trên backend với frontend URL:

**Railway/Render:**
- Settings → Variables
- Thêm: `ALLOWED_ORIGINS=https://your-frontend-url.com`
- Redeploy

**Hoặc Heroku:**
```bash
heroku config:set ALLOWED_ORIGINS=https://your-frontend-url.com
```

### Bước 6: Test (2 phút)

- [ ] Backend: `https://your-backend-url.com/` → "Chào mừng..."
- [ ] Frontend: `https://your-frontend-url.com` → Trang chủ load
- [ ] Test API: Frontend gọi được backend
- [ ] Test Admin: Login và upload hình ảnh

---

## ✅ Done!

Ứng dụng đã được deploy lên production! 🎉

---

## 📝 Environment Variables Summary

### Backend (.env hoặc Platform Variables):
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<random-string>
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-url.com
CLOUDINARY_CLOUD_NAME=... (optional)
CLOUDINARY_API_KEY=... (optional)
CLOUDINARY_API_SECRET=... (optional)
```

### Frontend (Platform Variables):
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

---

## 🔗 Useful Links

- **MongoDB Atlas Setup:** `MONGODB_ATLAS_SETUP.md`
- **Cloudinary Setup:** `CLOUDINARY_SETUP.md`
- **Full Deploy Guide:** `DEPLOY.md`
- **Deploy Checklist:** `DEPLOY_CHECKLIST.md`

---

**Need help?** Xem `DEPLOY.md` để có hướng dẫn chi tiết hơn.

