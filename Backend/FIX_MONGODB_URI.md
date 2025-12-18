# Fix: MONGODB_URI contains placeholder

Hướng dẫn sửa lỗi "MONGODB_URI contains placeholder. Please replace <db_password> with actual password".

## 🔍 Nguyên Nhân

File `.env` có `MONGODB_URI` chứa placeholder `<db_password>` thay vì password thực tế.

## ✅ Giải Pháp

### Option 1: Sử dụng Setup Helper (Khuyến nghị)

Chạy script helper để tự động tạo file `.env`:

```bash
cd Backend
npm run setup:env
```

Script sẽ hỏi bạn các thông tin:
- MongoDB Username
- MongoDB Password
- Cluster URL
- Database name
- PORT, NODE_ENV
- Cloudinary config (optional)

Script sẽ tự động:
- Encode password nếu có ký tự đặc biệt
- Tạo JWT_SECRET ngẫu nhiên
- Tạo file `.env` hoàn chỉnh

---

### Option 2: Tạo File .env Thủ Công

**Bước 1:** Tạo file `.env` trong thư mục `Backend/`

**Bước 2:** Copy nội dung từ `.env.example`:

```bash
cp .env.example .env
```

**Bước 3:** Mở file `.env` và thay thế:

```env
# Thay thế dòng này:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Bằng connection string thực tế của bạn từ MongoDB Atlas
```

---

### Option 3: Lấy Connection String từ MongoDB Atlas

1. Đăng nhập vào [MongoDB Atlas](https://cloud.mongodb.com/)
2. Vào **Database** → **Connect**
3. Chọn **Connect your application**
4. Copy connection string
5. Thay thế `<password>` bằng password thực tế
6. Thay thế `<dbname>` bằng tên database (ví dụ: `tndgranite`)

**Ví dụ:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/tndgranite?retryWrites=true&w=majority
```

---

## 🔐 Xử Lý Password Có Ký Tự Đặc Biệt

Nếu password có ký tự đặc biệt (`@`, `#`, `%`, `&`, `+`, `=`, ...), cần **encode URL**:

### Cách 1: Sử dụng JavaScript

```javascript
const password = "P@ssw0rd#123";
const encodedPassword = encodeURIComponent(password);
// Kết quả: P%40ssw0rd%23123
```

### Cách 2: Sử dụng Online Tool

- Truy cập: https://www.urlencoder.org/
- Paste password vào
- Copy encoded value

### Cách 3: Sử dụng Node.js

```bash
node -e "console.log(encodeURIComponent('P@ssw0rd#123'))"
```

**Ví dụ:**
- Password gốc: `P@ssw0rd#123`
- Password encoded: `P%40ssw0rd%23123`
- Connection string: `mongodb+srv://username:P%40ssw0rd%23123@cluster.mongodb.net/db`

---

## 📝 File .env Mẫu

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tndgranite?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-generated-secret-key-here
JWT_EXPIRES_IN=7d

# Cloudinary (Optional)
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
```

---

## ✅ Kiểm Tra

Sau khi tạo file `.env`, test kết nối:

```bash
cd Backend
npm run test:connection
```

Nếu thành công, bạn sẽ thấy:
```
✅ MongoDB connection successful
   Host: cluster0.xxxxx.mongodb.net
   Database: tndgranite
```

---

## 🐛 Troubleshooting

### Lỗi: "authentication failed"
- Kiểm tra username và password đúng chưa
- Kiểm tra password đã được encode nếu có ký tự đặc biệt
- Kiểm tra database user đã được tạo trong MongoDB Atlas

### Lỗi: "ENOTFOUND" hoặc "getaddrinfo"
- Kiểm tra cluster URL đúng chưa
- Kiểm tra IP address đã được whitelist trong MongoDB Atlas
- Kiểm tra internet connection

### Lỗi: "timeout"
- Kiểm tra IP address đã được whitelist
- Kiểm tra firewall settings
- Thử thêm IP `0.0.0.0/0` vào whitelist (cho phép tất cả IP)

---

## 📚 Xem Thêm

- MongoDB Atlas Setup: `../MONGODB_ATLAS_SETUP.md`
- Connection Test: `npm run test:connection`

---

**Sau khi fix, restart server và kiểm tra kết nối!**

