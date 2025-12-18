# Hướng Dẫn JWT_SECRET - TND Granite

Hướng dẫn về JWT_SECRET: nó là gì, được sử dụng ở đâu, và cách tạo một JWT_SECRET mạnh.

## 🔐 JWT_SECRET Là Gì?

JWT_SECRET là một chuỗi bí mật dùng để:
- **Sign (ký)** JWT tokens khi admin đăng nhập
- **Verify (xác thực)** JWT tokens khi admin truy cập protected routes

⚠️ **QUAN TRỌNG:** JWT_SECRET phải được giữ bí mật và không được commit lên Git!

---

## 📍 JWT_SECRET Được Sử Dụng Ở Đâu?

### 1. **Backend/src/controllers/adminAuth.controller.js** (Line 9)
```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};
```
**Chức năng:** Tạo JWT token khi admin đăng nhập thành công.

### 2. **Backend/src/middleware/auth.middleware.js** (Line 31)
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
```
**Chức năng:** Xác thực JWT token trong mỗi request đến protected routes.

---

## 🔧 Cách Cấu Hình JWT_SECRET

### Development (Local)

Tạo file `Backend/.env`:
```env
JWT_SECRET=your-development-secret-key-here
```

### Production

**Option 1: Railway/Render**
- Vào **Settings** → **Variables**
- Thêm: `JWT_SECRET=your-production-secret-key`

**Option 2: Heroku**
```bash
heroku config:set JWT_SECRET=your-production-secret-key
```

**Option 3: VPS**
- Thêm vào file `.env` trên server
- Đảm bảo file `.env` không được commit lên Git

---

## 🔑 Cách Tạo JWT_SECRET Mạnh

### Option 1: Sử dụng OpenSSL (Khuyến nghị)

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Windows (Git Bash):**
```bash
openssl rand -base64 32
```

### Option 2: Sử dụng Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option 3: Online Generator

- Truy cập: https://generate-secret.vercel.app/32
- Hoặc: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
- Chọn: Base64, 32 bytes

### Option 4: Tạo Thủ Công

Tạo một chuỗi ngẫu nhiên dài ít nhất 32 ký tự, bao gồm:
- Chữ cái (a-z, A-Z)
- Số (0-9)
- Ký tự đặc biệt (!@#$%^&*)

**Ví dụ:**
```
JWT_SECRET=K8j2#mP9$vL5@nR3&qW7!tY4*uI6^oE1%aS8
```

---

## ✅ Checklist JWT_SECRET

### Development
- [ ] Đã tạo file `Backend/.env`
- [ ] Đã thêm `JWT_SECRET` vào `.env`
- [ ] File `.env` đã được thêm vào `.gitignore`
- [ ] Đã test admin login hoạt động

### Production
- [ ] Đã tạo JWT_SECRET mạnh (32+ ký tự)
- [ ] Đã thêm vào platform environment variables
- [ ] Đã verify không commit lên Git
- [ ] Đã test admin login trên production

---

## 🚨 Lưu Ý Bảo Mật

### ✅ Nên Làm:
- ✅ Sử dụng JWT_SECRET khác nhau cho development và production
- ✅ JWT_SECRET dài ít nhất 32 ký tự
- ✅ Sử dụng ký tự ngẫu nhiên, không dự đoán được
- ✅ Lưu JWT_SECRET trong environment variables
- ✅ Không commit `.env` lên Git
- ✅ Rotate JWT_SECRET định kỳ (mỗi 3-6 tháng)

### ❌ Không Nên:
- ❌ Không dùng JWT_SECRET mặc định `'your-secret-key-change-in-production'`
- ❌ Không commit JWT_SECRET lên Git
- ❌ Không chia sẻ JWT_SECRET công khai
- ❌ Không dùng JWT_SECRET ngắn hoặc dễ đoán
- ❌ Không dùng cùng JWT_SECRET cho nhiều môi trường

---

## 🔄 Rotate JWT_SECRET (Đổi Secret)

Nếu JWT_SECRET bị lộ hoặc cần đổi:

### Bước 1: Tạo JWT_SECRET mới
```bash
openssl rand -base64 32
```

### Bước 2: Cập nhật trên Platform
- Railway/Render: Update trong Variables
- Heroku: `heroku config:set JWT_SECRET=new-secret`
- VPS: Update trong `.env` file

### Bước 3: Restart Backend
- Railway/Render: Redeploy
- Heroku: `heroku restart`
- VPS: `pm2 restart tndgranite-backend`

### Bước 4: Yêu Cầu Admin Đăng Nhập Lại
- Tất cả tokens cũ sẽ không còn hợp lệ
- Admin cần đăng nhập lại để nhận token mới

---

## 🧪 Test JWT_SECRET

### Kiểm tra JWT_SECRET có được load không:

**Tạo file test:** `Backend/src/utils/testJWTSecret.js`
```javascript
require('dotenv').config();

console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Đã được set' : '❌ Chưa được set');
console.log('Length:', process.env.JWT_SECRET?.length || 0);
console.log('Value:', process.env.JWT_SECRET ? '***hidden***' : 'undefined');
```

Chạy:
```bash
node src/utils/testJWTSecret.js
```

---

## 📝 Quick Reference

### Tạo JWT_SECRET:
```bash
# Linux/Mac/Windows Git Bash
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Set trên Platform:

**Railway/Render:**
```
Settings → Variables → Add: JWT_SECRET=your-secret
```

**Heroku:**
```bash
heroku config:set JWT_SECRET=your-secret
```

**VPS:**
```bash
# Thêm vào Backend/.env
JWT_SECRET=your-secret
```

---

## 🔍 Troubleshooting

### Lỗi: "Token không hợp lệ" sau khi deploy
**Nguyên nhân:** JWT_SECRET khác nhau giữa development và production
**Giải pháp:** Đảm bảo JWT_SECRET trên production đúng

### Lỗi: "JWT_SECRET is not defined"
**Nguyên nhân:** Chưa set JWT_SECRET trong environment variables
**Giải pháp:** Thêm JWT_SECRET vào `.env` hoặc platform variables

### Token không hoạt động sau khi đổi JWT_SECRET
**Nguyên nhân:** Tokens cũ được sign với secret cũ
**Giải pháp:** Yêu cầu admin đăng nhập lại để nhận token mới

---

## 📚 Tài Liệu Tham Khảo

- **JWT.io**: https://jwt.io
- **jsonwebtoken npm**: https://www.npmjs.com/package/jsonwebtoken
- **Best Practices**: https://github.com/auth0/node-jsonwebtoken#readme

---

**Lưu ý:** Luôn giữ JWT_SECRET bí mật và không commit lên Git! 🔒

