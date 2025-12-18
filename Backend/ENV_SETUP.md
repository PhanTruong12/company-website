# 🔧 Environment Variables Setup Guide

## 📋 Tổng quan

Backend sử dụng environment variables để cấu hình cho các môi trường khác nhau. File này hướng dẫn cách setup đầy đủ.

## 📁 Cấu trúc Files

```
Backend/
├── .env.example              # Template chung (không commit)
├── .env.development.example  # Template cho development
├── .env.production.example   # Template cho production
├── .env                      # File thực tế (KHÔNG commit - trong .gitignore)
├── .env.development          # File thực tế development (KHÔNG commit)
└── .env.production           # File thực tế production (KHÔNG commit)
```

## 🚀 Quick Start

### Development Setup:

```bash
cd Backend

# Copy template
cp .env.development.example .env.development

# Edit file và điền thông tin
# Windows: notepad .env.development
# Mac/Linux: nano .env.development

# Chạy server
npm run dev
```

### Production Setup:

```bash
cd Backend

# Copy template
cp .env.production.example .env.production

# Edit file và điền thông tin
# Windows: notepad .env.production
# Mac/Linux: nano .env.production

# Chạy server
npm run prod:local
```

## 📝 Environment Variables Reference

### Required Variables

| Variable | Description | Example | Required In |
|----------|-------------|---------|-------------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` | All |
| `NODE_ENV` | Environment mode | `development` or `production` | All |
| `JWT_SECRET` | Secret for JWT signing | Random string (min 32 chars) | All |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://yourdomain.com` | Production |

### Optional Variables

| Variable | Description | Default | When Needed |
|----------|-------------|---------|-------------|
| `PORT` | Server port | `5000` | Override default |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` | Custom expiration |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | Use Cloudinary |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - | Use Cloudinary |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - | Use Cloudinary |

## 🔐 Security Best Practices

### Development:
- ✅ Có thể dùng secret đơn giản (nhưng vẫn giữ bí mật)
- ✅ Localhost tự động được cho phép trong CORS
- ✅ Có thể dùng local MongoDB hoặc Atlas dev cluster

### Production:
- ⚠️ **PHẢI** dùng secret mạnh (minimum 32 characters)
- ⚠️ **PHẢI** set `ALLOWED_ORIGINS` để giới hạn CORS
- ⚠️ **NÊN** dùng Cloudinary cho image storage
- ⚠️ **PHẢI** đảm bảo MongoDB Atlas IP whitelist đã được cấu hình

## 🛠️ Generate JWT Secret

```bash
npm run generate:jwt-secret
```

Hoặc tự tạo:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📋 Setup Checklist

### Development:
- [ ] Copy `.env.development.example` to `.env.development`
- [ ] Set `MONGODB_URI` (Atlas dev hoặc local)
- [ ] Set `NODE_ENV=development`
- [ ] Generate và set `JWT_SECRET`
- [ ] (Optional) Set Cloudinary credentials
- [ ] Test connection: `npm run test:connection`
- [ ] Start server: `npm run dev`

### Production:
- [ ] Copy `.env.production.example` to `.env.production`
- [ ] Set `MONGODB_URI` (Atlas production)
- [ ] Set `NODE_ENV=production`
- [ ] Generate STRONG `JWT_SECRET` (min 32 chars)
- [ ] Set `ALLOWED_ORIGINS` (frontend production URLs)
- [ ] Set Cloudinary credentials (required)
- [ ] Verify MongoDB Atlas IP whitelist includes hosting platform
- [ ] Test connection: `npm run test:connection`
- [ ] Deploy với environment variables trên hosting platform

## 🌐 Hosting Platform Setup

### Railway:
1. Go to Project → Service → Variables
2. Add each variable from `.env.production`
3. Railway automatically uses these when deploying

### Render:
1. Go to Service → Environment
2. Add each variable from `.env.production`
3. Render automatically uses these when deploying

### Vercel (if using):
1. Go to Project → Settings → Environment Variables
2. Add each variable from `.env.production`
3. Select "Production" environment

## 🔍 Testing Environment Variables

### Test MongoDB Connection:
```bash
npm run test:connection
```

### Test API:
```bash
npm run test:api
```

### Check Current Environment:
```bash
# Development
npm run dev
# Check logs for: NODE_ENV=development

# Production
npm run prod:local
# Check logs for: NODE_ENV=production
```

## ⚠️ Common Issues

### 1. "MONGODB_URI is not defined"
- **Fix:** Đảm bảo file `.env` hoặc `.env.development`/`.env.production` tồn tại
- **Fix:** Kiểm tra tên biến đúng: `MONGODB_URI` (không có khoảng trắng)

### 2. "JWT_SECRET is not defined"
- **Fix:** Set `JWT_SECRET` trong file .env
- **Fix:** Generate secret: `npm run generate:jwt-secret`

### 3. CORS errors in production
- **Fix:** Set `ALLOWED_ORIGINS` trong `.env.production`
- **Fix:** Đảm bảo frontend URL đúng format: `https://yourdomain.com`

### 4. Cloudinary not working
- **Fix:** Set đầy đủ 3 biến: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Fix:** Kiểm tra credentials đúng từ Cloudinary Dashboard

## 📚 Related Documentation

- MongoDB Atlas Setup: `QUICK_FIX_MONGODB.md`
- CORS Configuration: `FIX_CORS.md`
- Running Both Environments: `RUN_BOTH_ENVIRONMENTS.md`
- Railway Deployment: `RAILWAY_SETUP.md`

## 🔒 Security Reminders

1. **NEVER commit `.env` files** - Chúng đã được thêm vào `.gitignore`
2. **NEVER share secrets** - JWT_SECRET, MongoDB password, Cloudinary secrets
3. **Use different secrets** - Development và Production phải khác nhau
4. **Rotate secrets regularly** - Đặc biệt nếu bị lộ
5. **Use environment variables** - Trên hosting platform thay vì hardcode

