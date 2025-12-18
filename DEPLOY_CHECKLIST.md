# Deploy Checklist - TND Granite Website

Checklist chi tiết để deploy Backend và Frontend lên production theo `DEPLOY.md`.

> **📁 Monorepo?** Nếu Backend và Frontend nằm trong cùng một repository, xem `DEPLOY_MONOREPO.md` để biết cách cấu hình Root Directory trên các platforms.

## 📋 Pre-Deployment Checklist

### 1. Chuẩn Bị MongoDB Atlas
- [ ] Đã tạo tài khoản MongoDB Atlas
- [ ] Đã tạo cluster production
- [ ] Đã tạo database user
- [ ] Đã whitelist IP (hoặc 0.0.0.0/0 cho development)
- [ ] Đã lấy connection string
- [ ] Đã test kết nối từ local

**Xem hướng dẫn:** `MONGODB_ATLAS_SETUP.md`

### 2. Chuẩn Bị Cloudinary (Optional nhưng khuyến nghị)
- [ ] Đã tạo tài khoản Cloudinary
- [ ] Đã lấy Cloud Name, API Key, API Secret
- [ ] Đã test upload hình ảnh

**Xem hướng dẫn:** `CLOUDINARY_SETUP.md`

### 3. Test Ứng Dụng
- [ ] Đã chạy `npm run test:api` - Tất cả tests pass
- [ ] Đã test tất cả chức năng trên frontend
- [ ] Đã test admin panel
- [ ] Đã test upload hình ảnh
- [ ] Không có lỗi trong console

**Xem hướng dẫn:** `TEST_CHECKLIST.md` và `QUICK_TEST.md`

---

## 🔧 Deploy Backend

### Bước 1: Cấu Hình Environment Variables

Tạo file `Backend/.env` với các biến sau:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tndgranite?retryWrites=true&w=majority

# Server Port (Platform sẽ tự động set, nhưng có thể override)
PORT=5000

# JWT Secret (Tạo chuỗi ngẫu nhiên mạnh)
# Có thể dùng: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=production

# CORS - Frontend URLs (phân cách bằng dấu phẩy)
# Ví dụ: ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ALLOWED_ORIGINS=https://your-frontend-url.com

# Cloudinary (Optional - nếu dùng Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Bước 2: Chọn Platform Deploy

#### Option A: Railway (Khuyến nghị - Dễ nhất)

1. **Đăng ký:** https://railway.app
2. **Tạo Project:** New Project → Deploy from GitHub
3. **Chọn Repository:** Chọn repo của bạn
4. **Cấu hình:**
   - Root Directory: `Backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables:** Thêm tất cả biến từ `.env`
6. **Deploy:** Tự động deploy sau khi push code

**Lưu ý:** Railway tự động tạo domain, có thể thêm custom domain sau.

#### Option B: Render

1. **Đăng ký:** https://render.com
2. **Tạo Web Service:** New → Web Service
3. **Connect GitHub:** Chọn repository
4. **Cấu hình:**
   - Name: `tndgranite-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `Backend`
5. **Environment Variables:** Thêm tất cả biến
6. **Deploy:** Click "Create Web Service"

#### Option C: Heroku

1. **Cài Heroku CLI:** https://devcenter.heroku.com/articles/heroku-cli
2. **Login:** `heroku login`
3. **Tạo App:** `heroku create tndgranite-backend`
4. **Set Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set NODE_ENV=production
   heroku config:set ALLOWED_ORIGINS=https://your-frontend-url.com
   ```
5. **Deploy:** `git push heroku main`
6. **Seed Data:** `heroku run npm run seed`

#### Option D: VPS/Server (Ubuntu)

**Xem hướng dẫn chi tiết trong:** `DEPLOY.md` - Option A: Deploy lên VPS/Server

**Tóm tắt:**
1. Cài Node.js và PM2
2. Clone repository
3. Cài dependencies: `npm install --production`
4. Tạo `.env` file
5. Chạy với PM2: `pm2 start ecosystem.config.js`
6. Cấu hình Nginx reverse proxy
7. Cài SSL với Let's Encrypt

### Bước 3: Seed Dữ Liệu

Sau khi deploy backend:

```bash
# Railway/Render: Vào shell và chạy
npm run seed

# Heroku:
heroku run npm run seed

# VPS:
cd Backend && npm run seed
```

### Bước 4: Kiểm Tra Backend

```bash
# Test health check
curl https://your-backend-url.com/

# Test API
curl https://your-backend-url.com/api/stone-types

# Test admin login
curl -X POST https://your-backend-url.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tndgranite.com","password":"admin123"}'
```

---

## 🎨 Deploy Frontend

### Bước 1: Cấu Hình Environment Variables

Tạo file `frontend/.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

**Lưu ý:** Thay `your-backend-url.com` bằng URL backend thực tế của bạn.

### Bước 2: Build Frontend

```bash
cd frontend
npm install
npm run build
```

Kiểm tra thư mục `dist/` đã được tạo.

### Bước 3: Chọn Platform Deploy

#### Option A: Vercel (Khuyến nghị cho Vite)

**Cách 1: Qua GitHub Integration (Khuyến nghị)**

1. **Đăng nhập:** https://vercel.com
2. **Import Project:** New Project → Import Git Repository
3. **Cấu hình:**
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Environment Variables:**
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.com/api`
5. **Deploy:** Click "Deploy"

**Cách 2: Qua CLI**

```bash
cd frontend
npm install -g vercel
vercel login
vercel
# Follow prompts
# Set VITE_API_BASE_URL when asked
vercel --prod
```

**File `vercel.json` đã được tạo sẵn! ✅**

#### Option B: Netlify

**Cách 1: Qua GitHub Integration**

1. **Đăng nhập:** https://netlify.com
2. **New Site:** Add new site → Import from Git
3. **Cấu hình:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`
4. **Environment Variables:**
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.com/api`
5. **Deploy:** Click "Deploy site"

**File `netlify.toml` đã được tạo sẵn! ✅**

**Cách 2: Qua CLI**

```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

#### Option C: VPS/Server với Nginx

**Xem hướng dẫn chi tiết trong:** `DEPLOY.md` - Option C: Deploy lên VPS/Server với Nginx

**Tóm tắt:**
1. Build frontend: `npm run build`
2. Upload `dist/` lên server
3. Cấu hình Nginx
4. Cài SSL với Let's Encrypt

### Bước 4: Kiểm Tra Frontend

- [ ] Trang chủ load được
- [ ] API calls hoạt động (kiểm tra Network tab)
- [ ] Hình ảnh hiển thị
- [ ] Admin login hoạt động
- [ ] Responsive trên mobile

---

## ✅ Post-Deployment Checklist

### Backend
- [ ] Health check: `https://your-backend-url.com/` → OK
- [ ] API endpoints hoạt động
- [ ] Admin login hoạt động
- [ ] Upload hình ảnh hoạt động
- [ ] MongoDB kết nối thành công
- [ ] Logs không có errors

### Frontend
- [ ] Trang chủ hiển thị đúng
- [ ] Tất cả API calls thành công
- [ ] Hình ảnh hiển thị đúng
- [ ] Admin panel hoạt động
- [ ] Responsive design OK
- [ ] Console không có errors

### Security
- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS configured correctly
- [ ] JWT_SECRET mạnh và bí mật
- [ ] MongoDB credentials bảo mật
- [ ] Environment variables không commit lên Git

### Performance
- [ ] Page load time < 3s
- [ ] API response time < 1s
- [ ] Images optimized
- [ ] CDN working (nếu dùng Cloudinary)

---

## 🔄 Update CORS Sau Khi Deploy Frontend

Sau khi có frontend URL, cập nhật `ALLOWED_ORIGINS` trên backend:

**Railway/Render:**
- Vào Settings → Environment Variables
- Thêm/Update: `ALLOWED_ORIGINS=https://your-frontend-url.com`
- Redeploy

**Heroku:**
```bash
heroku config:set ALLOWED_ORIGINS=https://your-frontend-url.com
```

**VPS:**
- Update trong `.env` file
- Restart: `pm2 restart tndgranite-backend`

---

## 🐛 Troubleshooting

### Backend không chạy
- Kiểm tra logs trên platform
- Kiểm tra environment variables
- Kiểm tra MongoDB connection

### Frontend không gọi được API
- Kiểm tra `VITE_API_BASE_URL` đúng chưa
- Kiểm tra CORS trên backend
- Kiểm tra Network tab trong browser

### Hình ảnh không hiển thị
- Nếu dùng Cloudinary: Kiểm tra Cloudinary config
- Nếu dùng local: Kiểm tra static files serving
- Kiểm tra URL trong database

---

## 📝 Quick Reference

### Backend URLs:
- **Railway:** `https://your-app.railway.app`
- **Render:** `https://your-app.onrender.com`
- **Heroku:** `https://your-app.herokuapp.com`
- **VPS:** `https://api.yourdomain.com`

### Frontend URLs:
- **Vercel:** `https://your-app.vercel.app`
- **Netlify:** `https://your-app.netlify.app`
- **VPS:** `https://yourdomain.com`

### Environment Variables Template:

**Backend:**
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=...
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-url.com
CLOUDINARY_CLOUD_NAME=... (optional)
```

**Frontend:**
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

---

## 🎯 Recommended Deployment Stack

**Option 1: Serverless (Khuyến nghị)**
- Backend: Railway hoặc Render
- Frontend: Vercel
- Database: MongoDB Atlas
- Storage: Cloudinary

**Option 2: VPS**
- Backend + Frontend: VPS với Nginx
- Database: MongoDB Atlas
- Storage: Cloudinary hoặc local

---

**Chúc bạn deploy thành công! 🚀**

Xem chi tiết trong `DEPLOY.md` nếu cần thêm thông tin.

