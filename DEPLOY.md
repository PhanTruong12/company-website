# Hướng Dẫn Deploy - TND Granite Website

Hướng dẫn chi tiết để deploy Backend và Frontend của website TND Granite lên production.

> **📁 Monorepo?** Nếu Backend và Frontend nằm trong cùng một repository, xem `DEPLOY_MONOREPO.md` để biết cách cấu hình Root Directory trên các platforms.

## 📋 Mục Lục

1. [Chuẩn bị](#chuẩn-bị)
2. [Deploy Backend](#deploy-backend)
3. [Deploy Frontend](#deploy-frontend)
4. [Cấu hình Biến Môi Trường](#cấu-hình-biến-môi-trường)
5. [Deploy trên các nền tảng](#deploy-trên-các-nền-tảng)

---

## 🚀 Chuẩn Bị

### Yêu cầu hệ thống:
- Node.js >= 18.x
- MongoDB Database (MongoDB Atlas hoặc self-hosted)
- Git
- Tài khoản trên nền tảng deploy (Vercel, Netlify, Heroku, VPS, etc.)

### Checklist trước khi deploy:
- [ ] Đã test kỹ ứng dụng ở môi trường development
- [ ] Đã chuẩn bị MongoDB production database
- [ ] Đã chuẩn bị domain (nếu có)
- [ ] Đã chuẩn bị SSL certificate (HTTPS)

---

## 🔧 Deploy Backend

### 1. Chuẩn bị MongoDB Production

#### Option A: MongoDB Atlas (Khuyến nghị)
1. Đăng ký tài khoản tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster mới
3. Tạo database user
4. Whitelist IP (hoặc `0.0.0.0/0` để cho phép mọi IP)
5. Lấy connection string: `mongodb+srv://username:password@cluster.mongodb.net/tndgranite?retryWrites=true&w=majority`

#### Option B: Self-hosted MongoDB
- Cài đặt MongoDB trên VPS/server
- Cấu hình firewall và authentication
- Connection string: `mongodb://username:password@your-server-ip:27017/tndgranite`

### 2. Cấu hình Biến Môi Trường Backend

Tạo file `.env` trong thư mục `Backend/`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tndgranite?retryWrites=true&w=majority

# Server Port
PORT=5000

# JWT Secret (tạo một chuỗi ngẫu nhiên mạnh)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=production
```

**⚠️ LƯU Ý:** 
- Không commit file `.env` lên Git
- Sử dụng JWT_SECRET mạnh và ngẫu nhiên
- Bảo mật thông tin database

### 3. Deploy Backend lên các nền tảng

#### Option A: Deploy lên VPS/Server (Ubuntu/Debian)

**Bước 1: Cài đặt Node.js và PM2**
```bash
# Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2 (Process Manager)
sudo npm install -g pm2
```

**Bước 2: Clone và cài đặt dependencies**
```bash
# Clone repository
git clone <your-repo-url>
cd TNDGranite/Webiste/Source/Backend

# Cài đặt dependencies
npm install --production

# Tạo file .env
nano .env
# (Nhập các biến môi trường như trên)
```

**Bước 3: Seed dữ liệu (nếu cần)**
```bash
npm run seed
```

**Bước 4: Chạy với PM2**
```bash
# Start ứng dụng
pm2 start server.js --name tndgranite-backend

# Lưu cấu hình PM2
pm2 save
pm2 startup

# Xem logs
pm2 logs tndgranite-backend

# Restart
pm2 restart tndgranite-backend
```

**Bước 5: Cấu hình Nginx (Reverse Proxy)**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/tndgranite-backend
```

Nội dung file:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Thay bằng domain của bạn

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Kích hoạt:
```bash
sudo ln -s /etc/nginx/sites-available/tndgranite-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Bước 6: Cài đặt SSL với Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Option B: Deploy lên Heroku

**Bước 1: Cài đặt Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Tải từ https://devcenter.heroku.com/articles/heroku-cli
```

**Bước 2: Login và tạo app**
```bash
heroku login
cd Backend
heroku create tndgranite-backend
```

**Bước 3: Cấu hình biến môi trường**
```bash
heroku config:set MONGODB_URI=your-mongodb-connection-string
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production
```

**Bước 4: Deploy**
```bash
git push heroku main
```

**Bước 5: Seed dữ liệu**
```bash
heroku run npm run seed
```

#### Option C: Deploy lên Railway/Render

**Railway:**
1. Đăng ký tại [Railway](https://railway.app)
2. Tạo project mới → Deploy from GitHub
3. Chọn repository và thư mục `Backend`
4. Thêm biến môi trường trong Settings
5. Deploy tự động

**Render:**
1. Đăng ký tại [Render](https://render.com)
2. Tạo Web Service mới
3. Connect GitHub repository
4. Cấu hình:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `Backend`
5. Thêm biến môi trường
6. Deploy

### 4. Kiểm tra Backend đã chạy

```bash
# Test API
curl https://your-backend-url.com/api/stone-types

# Hoặc mở trình duyệt
https://your-backend-url.com
```

---

## 🎨 Deploy Frontend

### 1. Cập nhật API URL trong Frontend

Cần cập nhật API URL trong các service files để trỏ đến backend production:

**Tạo file `.env` trong thư mục `frontend/`:**
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

**Cập nhật các service files để sử dụng biến môi trường:**

`frontend/src/services/stone.service.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

`frontend/src/services/interiorImage.service.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

`frontend/src/services/adminAuth.service.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

`frontend/src/services/adminImage.service.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

`frontend/src/services/search.service.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

### 2. Build Frontend

```bash
cd frontend
npm install
npm run build
```

Sau khi build, thư mục `dist/` sẽ chứa các file production-ready.

### 3. Deploy Frontend lên các nền tảng

#### Option A: Deploy lên Vercel (Khuyến nghị cho React/Vite)

**Bước 1: Cài đặt Vercel CLI**
```bash
npm install -g vercel
```

**Bước 2: Login**
```bash
vercel login
```

**Bước 3: Deploy**
```bash
cd frontend
vercel
```

**Bước 4: Cấu hình biến môi trường trên Vercel Dashboard**
- Vào Project Settings → Environment Variables
- Thêm: `VITE_API_BASE_URL=https://your-backend-url.com/api`

**Bước 5: Redeploy**
```bash
vercel --prod
```

**Hoặc qua GitHub Integration:**
1. Đăng nhập [Vercel](https://vercel.com)
2. Import Git Repository
3. Cấu hình:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Thêm Environment Variable: `VITE_API_BASE_URL`
5. Deploy

#### Option B: Deploy lên Netlify

**Bước 1: Cài đặt Netlify CLI**
```bash
npm install -g netlify-cli
```

**Bước 2: Login và Deploy**
```bash
cd frontend
netlify login
netlify deploy --prod --dir=dist
```

**Hoặc qua Netlify Dashboard:**
1. Đăng nhập [Netlify](https://netlify.com)
2. Add new site → Import from Git
3. Cấu hình:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`
4. Thêm Environment Variable: `VITE_API_BASE_URL`
5. Deploy

#### Option C: Deploy lên VPS/Server với Nginx

**Bước 1: Build và upload files**
```bash
cd frontend
npm run build
# Upload thư mục dist lên server
scp -r dist/* user@your-server:/var/www/tndgranite-frontend
```

**Bước 2: Cấu hình Nginx**
```bash
sudo nano /etc/nginx/sites-available/tndgranite-frontend
```

Nội dung:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/tndgranite-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

Kích hoạt:
```bash
sudo ln -s /etc/nginx/sites-available/tndgranite-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Bước 3: Cài đặt SSL**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Option D: Deploy lên GitHub Pages

**Bước 1: Cài đặt gh-pages**
```bash
cd frontend
npm install --save-dev gh-pages
```

**Bước 2: Cập nhật `package.json`**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/tndgranite"
}
```

**Bước 3: Deploy**
```bash
npm run deploy
```

---

## ⚙️ Cấu Hình Biến Môi Trường

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tndgranite
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Frontend (.env hoặc trên Platform)
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

---

## 🔒 Bảo Mật Production

### Checklist bảo mật:

- [ ] **Backend:**
  - [ ] Đã đổi JWT_SECRET thành chuỗi ngẫu nhiên mạnh
  - [ ] Đã bảo mật MongoDB connection string
  - [ ] Đã cấu hình CORS chỉ cho phép domain frontend
  - [ ] Đã enable HTTPS/SSL
  - [ ] Đã cấu hình rate limiting (nếu cần)
  - [ ] Đã ẩn thông tin lỗi trong production (NODE_ENV=production)

- [ ] **Frontend:**
  - [ ] Đã cập nhật API URL sang production
  - [ ] Đã enable HTTPS
  - [ ] Đã cấu hình CSP headers (nếu cần)
  - [ ] Đã kiểm tra không có thông tin nhạy cảm trong code

- [ ] **Database:**
  - [ ] Đã tạo user riêng cho production (không dùng admin)
  - [ ] Đã whitelist IP (hoặc chỉ cho phép từ backend server)
  - [ ] Đã enable MongoDB authentication
  - [ ] Đã backup database định kỳ

---

## 🧪 Kiểm Tra Sau Khi Deploy

### Backend:
```bash
# Test API endpoints
curl https://your-backend-url.com/api/stone-types
curl https://your-backend-url.com/api/interior-images

# Test admin login
curl -X POST https://your-backend-url.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tndgranite.com","password":"admin123"}'
```

### Frontend:
- [ ] Trang chủ load được
- [ ] Showroom hiển thị hình ảnh
- [ ] Search hoạt động
- [ ] Admin login hoạt động
- [ ] Upload hình ảnh hoạt động
- [ ] Responsive trên mobile

---

## 🐛 Troubleshooting

### Backend không kết nối được MongoDB
- Kiểm tra MONGODB_URI đúng chưa
- Kiểm tra IP whitelist trên MongoDB Atlas
- Kiểm tra firewall/security groups

### Frontend không gọi được API
- Kiểm tra CORS trên backend
- Kiểm tra VITE_API_BASE_URL đúng chưa
- Kiểm tra network tab trong browser console

### Hình ảnh không hiển thị
- Kiểm tra đường dẫn `/uploads` trên backend
- Kiểm tra quyền truy cập file
- Kiểm tra CORS cho static files

### Admin không đăng nhập được
- Kiểm tra đã seed admin account chưa
- Kiểm tra JWT_SECRET đúng chưa
- Kiểm tra logs backend

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề khi deploy, vui lòng:
1. Kiểm tra logs trên platform deploy
2. Kiểm tra browser console (F12)
3. Kiểm tra network requests
4. Xem lại hướng dẫn trên

---

## 📝 Ghi Chú

- **Development:** Sử dụng `npm run dev` cho cả backend và frontend
- **Production:** Sử dụng `npm start` cho backend và `npm run build` cho frontend
- **Backup:** Nên backup database định kỳ
- **Monitoring:** Cân nhắc sử dụng monitoring tools như PM2 Plus, Sentry, etc.

---

**Chúc bạn deploy thành công! 🎉**

