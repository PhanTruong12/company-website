# Hướng Dẫn Deploy Monorepo - Backend + Frontend

Hướng dẫn deploy khi Backend và Frontend nằm trong cùng một repository (monorepo).

## 📁 Cấu Trúc Repository

```
TNDGranite/
├── Backend/
│   ├── src/
│   ├── server.js
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
└── README.md
```

---

## 🚀 Deploy Backend từ Monorepo

### Option 1: Railway

**Bước 1: Tạo Backend Service**
1. Đăng nhập: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. Chọn repository của bạn
4. **Settings** → **Root Directory**: `Backend`
5. **Settings** → **Build Command**: `npm install`
6. **Settings** → **Start Command**: `npm start`

**Bước 2: Environment Variables**
- Vào **Variables** tab
- Thêm các biến:
  ```
  MONGODB_URI=mongodb+srv://...
  JWT_SECRET=...
  NODE_ENV=production
  ALLOWED_ORIGINS=https://your-frontend-url.com
  ```

**Bước 3: Deploy**
- Railway tự động deploy khi bạn push code
- Copy URL backend (ví dụ: `https://xxx.railway.app`)

---

### Option 2: Render

**Bước 1: Tạo Backend Service**
1. Đăng nhập: https://render.com
2. **New** → **Web Service**
3. **Connect GitHub** → Chọn repository
4. **Cấu hình:**
   - **Name**: `tndgranite-backend`
   - **Root Directory**: `Backend` ⭐ (Quan trọng!)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

**Bước 2: Environment Variables**
- Scroll xuống **Environment Variables**
- Thêm các biến như trên

**Bước 3: Deploy**
- Click **Create Web Service**
- Render sẽ build và deploy
- Copy URL backend

---

### Option 3: Heroku

**Bước 1: Tạo App**
```bash
heroku login
heroku create tndgranite-backend
```

**Bước 2: Cấu hình Root Directory**

Tạo file `Backend/package.json` với script `heroku-postbuild` (nếu cần):

Hoặc sử dụng `heroku.yml`:

Tạo file `Backend/heroku.yml`:
```yaml
build:
  config:
    NPM_CONFIG_PRODUCTION: false
run:
  web: node server.js
```

**Bước 3: Deploy**
```bash
cd Backend
git subtree push --prefix Backend heroku main
# Hoặc
git push heroku `git subtree split --prefix Backend main`:main --force
```

**Hoặc dùng Heroku CLI:**
```bash
# Set buildpack
heroku buildpacks:set heroku/nodejs -a tndgranite-backend

# Set root directory (qua app.json)
```

Tạo file `Backend/app.json`:
```json
{
  "name": "TND Granite Backend",
  "description": "Backend API for TND Granite",
  "repository": "https://github.com/yourusername/yourrepo",
  "logo": "",
  "keywords": ["node", "express", "mongodb"],
  "image": "heroku/nodejs",
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ]
}
```

**Bước 4: Set Environment Variables**
```bash
heroku config:set MONGODB_URI=... -a tndgranite-backend
heroku config:set JWT_SECRET=... -a tndgranite-backend
heroku config:set NODE_ENV=production -a tndgranite-backend
```

---

### Option 4: VPS/Server

**Bước 1: Clone Repository**
```bash
git clone <your-repo-url>
cd TNDGranite/Webiste/Source
```

**Bước 2: Deploy Backend**
```bash
cd Backend
npm install --production
cp .env.example .env
# Edit .env với production values
npm run seed
pm2 start ecosystem.config.js --env production
```

**Bước 3: Cấu hình Nginx**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        # ... (xem DEPLOY.md)
    }
}
```

---

## 🎨 Deploy Frontend từ Monorepo

### Option 1: Vercel

**Bước 1: Import Project**
1. Đăng nhập: https://vercel.com
2. **Add New Project** → **Import Git Repository**
3. Chọn repository của bạn

**Bước 2: Cấu Hình**
- **Framework Preset**: `Vite` (hoặc để Vercel tự detect)
- **Root Directory**: `frontend` ⭐ (Quan trọng!)
- **Build Command**: `npm run build` (hoặc để mặc định)
- **Output Directory**: `dist`
- **Install Command**: `npm install` (hoặc để mặc định)

**Bước 3: Environment Variables**
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend-url.com/api`

**Bước 4: Deploy**
- Click **Deploy**
- Vercel sẽ build và deploy frontend
- Copy URL frontend

**Lưu ý:** File `frontend/vercel.json` đã được tạo sẵn với cấu hình phù hợp!

---

### Option 2: Netlify

**Bước 1: Import Project**
1. Đăng nhập: https://netlify.com
2. **Add new site** → **Import from Git**
3. Chọn repository

**Bước 2: Cấu Hình**
- **Base directory**: `frontend` ⭐ (Quan trọng!)
- **Build command**: `npm run build`
- **Publish directory**: `dist`

**Bước 3: Environment Variables**
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend-url.com/api`

**Bước 4: Deploy**
- Click **Deploy site**
- Netlify sẽ build và deploy

**Lưu ý:** File `frontend/netlify.toml` đã được tạo sẵn với cấu hình phù hợp!

---

### Option 3: VPS/Server

**Bước 1: Build Frontend**
```bash
cd frontend
npm install
npm run build
```

**Bước 2: Upload dist/ lên Server**
```bash
scp -r dist/* user@server:/var/www/tndgranite-frontend
```

**Bước 3: Cấu hình Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/tndgranite-frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔄 Workflow Deploy Monorepo

### 1. Deploy Backend Trước

```bash
# 1. Push code lên GitHub
git add .
git commit -m "Update backend"
git push origin main

# 2. Platform tự động deploy (Railway/Render)
# Hoặc manual deploy (Heroku/VPS)
```

### 2. Lấy Backend URL

Sau khi backend deploy xong:
- Railway: `https://xxx.railway.app`
- Render: `https://xxx.onrender.com`
- Heroku: `https://xxx.herokuapp.com`
- VPS: `https://api.yourdomain.com`

### 3. Deploy Frontend

```bash
# 1. Cập nhật .env.production với backend URL
# VITE_API_BASE_URL=https://your-backend-url.com/api

# 2. Push code
git add .
git commit -m "Update frontend"
git push origin main

# 3. Platform tự động deploy (Vercel/Netlify)
```

### 4. Cập Nhật CORS trên Backend

Sau khi có frontend URL, cập nhật `ALLOWED_ORIGINS`:

**Railway/Render:**
- Settings → Variables
- Thêm/Update: `ALLOWED_ORIGINS=https://your-frontend-url.com`
- Redeploy

**Heroku:**
```bash
heroku config:set ALLOWED_ORIGINS=https://your-frontend-url.com
```

---

## 📝 Cấu Hình Root Directory trên Các Platforms

### Railway
- **Settings** → **Root Directory**: `Backend` hoặc `frontend`
- Mỗi service có thể có root directory riêng

### Render
- **Root Directory**: `Backend` hoặc `frontend`
- Mỗi service có thể có root directory riêng

### Vercel
- **Root Directory**: `frontend`
- Có thể deploy nhiều projects từ cùng repo với root directory khác nhau

### Netlify
- **Base directory**: `frontend`
- Có thể deploy nhiều sites từ cùng repo

### Heroku
- Không hỗ trợ root directory trực tiếp
- Cần dùng `git subtree` hoặc tách thành 2 repos riêng

---

## 🎯 Recommended Setup cho Monorepo

### Option 1: Railway + Vercel (Khuyến nghị)

**Backend trên Railway:**
- Root Directory: `Backend`
- Auto-deploy từ GitHub
- Dễ cấu hình

**Frontend trên Vercel:**
- Root Directory: `frontend`
- Auto-deploy từ GitHub
- Tốt cho Vite/React

**Ưu điểm:**
- ✅ Dễ setup
- ✅ Auto-deploy
- ✅ Free tier tốt
- ✅ Không cần config phức tạp

---

### Option 2: Render + Netlify

**Backend trên Render:**
- Root Directory: `Backend`
- Free tier có sẵn

**Frontend trên Netlify:**
- Base directory: `frontend`
- Free tier tốt

---

### Option 3: VPS (Cả 2 trên cùng server)

**Backend:**
```bash
cd Backend
npm install --production
pm2 start ecosystem.config.js
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Copy dist/ lên Nginx
```

**Nginx config 2 sites:**
- `api.yourdomain.com` → Backend (port 5000)
- `yourdomain.com` → Frontend (dist/)

---

## 🔧 Troubleshooting Monorepo Deploy

### Lỗi: "Cannot find module" trên Backend
**Nguyên nhân:** Root directory chưa được set đúng
**Giải pháp:** 
- Railway/Render: Kiểm tra Root Directory = `Backend`
- Heroku: Dùng `git subtree` hoặc tách repo

### Lỗi: "Build failed" trên Frontend
**Nguyên nhân:** Root directory chưa được set đúng
**Giải pháp:**
- Vercel: Kiểm tra Root Directory = `frontend`
- Netlify: Kiểm tra Base directory = `frontend`

### Lỗi: "Package.json not found"
**Nguyên nhân:** Platform đang tìm package.json ở root thay vì trong Backend/frontend
**Giải pháp:** Set Root Directory đúng

### Build chậm
**Nguyên nhân:** Platform đang build cả repo
**Giải pháp:** 
- Set Root Directory đúng
- Có thể thêm `.vercelignore` hoặc `.netlifyignore`

---

## 📋 Checklist Deploy Monorepo

### Backend
- [ ] Đã set Root Directory = `Backend` trên platform
- [ ] Đã thêm Environment Variables
- [ ] Đã test deploy thành công
- [ ] Đã seed dữ liệu
- [ ] Đã test API endpoints

### Frontend
- [ ] Đã set Root Directory = `frontend` trên platform
- [ ] Đã thêm `VITE_API_BASE_URL`
- [ ] Đã test deploy thành công
- [ ] Đã test API calls từ frontend

### CORS
- [ ] Đã cập nhật `ALLOWED_ORIGINS` với frontend URL
- [ ] Đã test CORS hoạt động đúng

---

## 💡 Tips

1. **Tách thành 2 Projects riêng** trên mỗi platform:
   - `tndgranite-backend` (Root: `Backend`)
   - `tndgranite-frontend` (Root: `frontend`)

2. **Sử dụng GitHub Actions** để tự động deploy cả 2:
   - Có thể tạo workflow riêng cho backend và frontend

3. **Environment Variables:**
   - Backend: Set trên backend platform
   - Frontend: Set trên frontend platform

4. **Monitoring:**
   - Backend: Xem logs trên Railway/Render/Heroku
   - Frontend: Xem logs trên Vercel/Netlify

---

## 🚀 Quick Start cho Monorepo

### 1. Deploy Backend (Railway)
```
Railway → New Project → GitHub → Root: Backend → Variables → Deploy
```

### 2. Deploy Frontend (Vercel)
```
Vercel → New Project → GitHub → Root: frontend → Variables → Deploy
```

### 3. Update CORS
```
Backend Platform → Variables → ALLOWED_ORIGINS → Frontend URL
```

**Done! 🎉**

---

Xem thêm:
- `DEPLOY.md` - Hướng dẫn chi tiết
- `DEPLOY_QUICK_START.md` - Quick start guide
- `DEPLOY_CHECKLIST.md` - Checklist đầy đủ

