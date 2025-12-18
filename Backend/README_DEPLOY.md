# Backend Deployment Guide

Hướng dẫn deploy Backend lên các nền tảng khác nhau.

## 📦 Files Đã Chuẩn Bị

- ✅ `ecosystem.config.js` - PM2 configuration (cho VPS)
- ✅ `Procfile` - Heroku configuration
- ✅ `server.js` - Đã cấu hình CORS cho production
- ✅ `.env.example` - Template cho environment variables

## 🚀 Quick Deploy

### Railway (Khuyến nghị - Dễ nhất)

1. Đăng ký tại https://railway.app
2. New Project → Deploy from GitHub
3. Chọn repository và thư mục `Backend`
4. Thêm Environment Variables (xem `.env.example`)
5. Deploy tự động

### Render

1. Đăng ký tại https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Cấu hình:
   - Root Directory: `Backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Thêm Environment Variables
6. Deploy

### Heroku

```bash
heroku login
heroku create tndgranite-backend
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...
heroku config:set NODE_ENV=production
git push heroku main
heroku run npm run seed
```

### VPS với PM2

```bash
# Cài đặt PM2
npm install -g pm2

# Start với PM2
pm2 start ecosystem.config.js --env production

# Lưu cấu hình
pm2 save
pm2 startup
```

## 🔧 Environment Variables

Xem `.env.example` để biết các biến môi trường cần thiết.

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run seed` - Seed initial data
- `npm run test:api` - Test API endpoints
- `npm run migrate:atlas` - Migrate database to Atlas
- `npm run migrate:cloudinary` - Migrate images to Cloudinary

## 🔍 Health Check

Sau khi deploy, test:
```bash
curl https://your-backend-url.com/
# Should return: "Chào mừng đến với API giới thiệu công ty!"
```

## 📚 Xem Thêm

- Full deployment guide: `../DEPLOY.md`
- MongoDB Atlas setup: `../MONGODB_ATLAS_SETUP.md`
- Cloudinary setup: `../CLOUDINARY_SETUP.md`

