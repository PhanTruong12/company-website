# Hướng Dẫn Setup MongoDB Atlas - TND Granite

Hướng dẫn chi tiết cách setup MongoDB Atlas (Cloud Database) cho dự án TND Granite.

## 📋 Mục Lục

1. [Tạo tài khoản MongoDB Atlas](#1-tạo-tài-khoản-mongodb-atlas)
2. [Tạo Cluster](#2-tạo-cluster)
3. [Cấu hình Database User](#3-cấu-hình-database-user)
4. [Whitelist IP Address](#4-whitelist-ip-address)
5. [Lấy Connection String](#5-lấy-connection-string)
6. [Kết nối từ Backend](#6-kết-nối-từ-backend)
7. [Seed dữ liệu](#7-seed-dữ-liệu)
8. [Troubleshooting](#troubleshooting)

---

## 1. Tạo Tài Khoản MongoDB Atlas

### Bước 1: Đăng ký
1. Truy cập: https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** hoặc **"Sign Up"**
3. Điền thông tin:
   - Email
   - Password (tối thiểu 8 ký tự)
   - First Name, Last Name
4. Chọn **"I agree to the Terms of Service"**
5. Click **"Create your Atlas account"**

### Bước 2: Xác thực Email
- Kiểm tra email và click link xác thực
- Hoàn tất thông tin công ty (có thể skip)

---

## 2. Tạo Cluster

### Bước 1: Chọn Cloud Provider & Region
1. Sau khi đăng nhập, bạn sẽ thấy màn hình **"Deploy a cloud database"**
2. Chọn **Cloud Provider**:
   - **AWS** (Khuyến nghị - phổ biến nhất)
   - **Google Cloud**
   - **Azure**
3. Chọn **Region**:
   - **Singapore (ap-southeast-1)** - Gần Việt Nam nhất
   - **Tokyo (ap-northeast-1)** - Tốc độ tốt
   - Hoặc chọn region gần bạn nhất

### Bước 2: Chọn Cluster Tier
- **M0 (Free Tier)** - Khuyến nghị cho development/testing
  - 512 MB storage
  - Shared RAM
  - Đủ cho dự án nhỏ
- **M2/M5** - Cho production (có phí)

### Bước 3: Đặt tên Cluster
- **Cluster Name**: `TNDGranite-Cluster` (hoặc tên bạn muốn)
- Click **"Create Cluster"**

⏱️ **Lưu ý**: Quá trình tạo cluster mất khoảng 3-5 phút

---

## 3. Cấu Hình Database User

### Bước 1: Tạo Database User
1. Sau khi cluster tạo xong, bạn sẽ thấy popup **"Create your first database user"**
2. Hoặc vào **"Database Access"** ở menu bên trái
3. Click **"Add New Database User"**

### Bước 2: Điền thông tin
- **Authentication Method**: Password
- **Username**: `tndgranite_admin` (hoặc tên bạn muốn)
- **Password**: 
  - Click **"Autogenerate Secure Password"** (khuyến nghị)
  - Hoặc tự đặt password mạnh (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt)
- **Database User Privileges**: 
  - Chọn **"Atlas admin"** (full access)
  - Hoặc **"Read and write to any database"** (đủ cho dự án)

### Bước 3: Lưu thông tin
⚠️ **QUAN TRỌNG**: 
- **Copy password ngay** (nếu dùng Autogenerate) - bạn sẽ không thấy lại được!
- Hoặc lưu vào password manager

4. Click **"Add User"**

---

## 4. Whitelist IP Address

### Bước 1: Vào Network Access
1. Click **"Network Access"** ở menu bên trái
2. Click **"Add IP Address"**

### Bước 2: Thêm IP
Có 2 cách:

#### Option A: Cho phép mọi IP (Development/Testing)
- Click **"Allow Access from Anywhere"**
- IP Address: `0.0.0.0/0`
- Comment: `Development - Allow all IPs`
- Click **"Confirm"**

⚠️ **Lưu ý**: Không an toàn cho production! Chỉ dùng cho testing.

#### Option B: Chỉ cho phép IP cụ thể (Production)
1. Tìm IP của bạn:
   - Truy cập: https://www.whatismyip.com
   - Copy IP address
2. Thêm IP:
   - IP Address: `YOUR_IP_ADDRESS/32` (ví dụ: `123.45.67.89/32`)
   - Comment: `My Development IP`
   - Click **"Confirm"**

### Bước 3: Thêm IP của Server (nếu deploy)
- Nếu deploy lên VPS/Server, thêm IP của server đó
- Nếu deploy lên Heroku/Railway/Render, họ sẽ cung cấp IP ranges

---

## 5. Lấy Connection String

### Bước 1: Vào Database
1. Click **"Database"** ở menu bên trái
2. Click **"Connect"** trên cluster của bạn

### Bước 2: Chọn Connection Method
- Chọn **"Connect your application"**

### Bước 3: Copy Connection String
1. **Driver**: Node.js
2. **Version**: 5.5 or later (hoặc version mới nhất)
3. Connection string sẽ hiển thị:
   ```
   mongodb+srv://<username>:<password>@tndgranite-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **Thay thế**:
   - `<username>` → username bạn đã tạo (ví dụ: `tndgranite_admin`)
   - `<password>` → password bạn đã tạo
   
   Ví dụ sau khi thay:
   ```
   mongodb+srv://tndgranite_admin:MyPassword123@tndgranite-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Copy toàn bộ connection string**

### Bước 4: Thêm Database Name
Thêm tên database vào connection string:
```
mongodb+srv://tndgranite_admin:MyPassword123@tndgranite-cluster.xxxxx.mongodb.net/tndgranite?retryWrites=true&w=majority
```
(Thêm `/tndgranite` sau `.net`)

---

## 6. Kết Nối Từ Backend

### Bước 1: Tạo file .env
Trong thư mục `Backend/`, tạo file `.env`:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://tndgranite_admin:MyPassword123@tndgranite-cluster.xxxxx.mongodb.net/tndgranite?retryWrites=true&w=majority

# Server Port
PORT=5000

# JWT Secret (tạo một chuỗi ngẫu nhiên mạnh)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=development
```

⚠️ **Lưu ý**: 
- Thay `MyPassword123` bằng password thực tế của bạn
- Thay `tndgranite-cluster.xxxxx` bằng cluster name thực tế của bạn
- **KHÔNG commit file `.env` lên Git!**

### Bước 2: Kiểm tra kết nối
```bash
cd Backend
npm install
npm run dev
```

Nếu thành công, bạn sẽ thấy:
```
MongoDB Connected: tndgranite-cluster-shard-00-00.xxxxx.mongodb.net:27017
Server đang chạy trên cổng: 5000
```

### Bước 3: Test kết nối
```bash
cd Backend
npm run test:api
```

Hoặc test thủ công:
```bash
curl http://localhost:5000/api/stone-types
```

---

## 7. Seed Dữ Liệu

### Bước 1: Chạy seed script
```bash
cd Backend
npm run seed
```

Script này sẽ tạo:
- ✅ Stone Types (Thạch Anh, Nung Kết, Tự Nhiên)
- ✅ Interior Types
- ✅ Admin account mặc định:
  - Email: `admin@tndgranite.com`
  - Password: `admin123`

### Bước 2: Kiểm tra dữ liệu trên MongoDB Atlas
1. Vào **"Database"** → Click **"Browse Collections"**
2. Bạn sẽ thấy:
   - Database: `tndgranite`
   - Collections: `stonetypes`, `interiortypes`, `admins`

---

## 🔍 Kiểm Tra Kết Nối

### Trên MongoDB Atlas Dashboard
1. Vào **"Database"** → **"Collections"**
2. Bạn sẽ thấy database `tndgranite` và các collections

### Từ Backend
```bash
# Test API
curl http://localhost:5000/api/stone-types

# Test Admin Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tndgranite.com","password":"admin123"}'
```

---

## 🐛 Troubleshooting

### Lỗi: "MongoServerError: bad auth"
**Nguyên nhân**: Username hoặc password sai
**Giải pháp**:
1. Kiểm tra lại username và password trong connection string
2. Đảm bảo đã URL encode password nếu có ký tự đặc biệt
3. Tạo lại database user nếu cần

### Lỗi: "MongoServerError: IP not whitelisted"
**Nguyên nhân**: IP của bạn chưa được whitelist
**Giải pháp**:
1. Vào **"Network Access"** trên MongoDB Atlas
2. Thêm IP của bạn hoặc `0.0.0.0/0` (cho development)

### Lỗi: "MongooseServerSelectionError: connect ECONNREFUSED"
**Nguyên nhân**: 
- Connection string sai
- Network issue
- Cluster chưa sẵn sàng
**Giải pháp**:
1. Kiểm tra connection string đúng chưa
2. Đảm bảo cluster đã được tạo xong (status: Running)
3. Kiểm tra internet connection

### Lỗi: "MongoServerError: database name is invalid"
**Nguyên nhân**: Tên database có ký tự không hợp lệ
**Giải pháp**:
- Tên database chỉ được chứa: chữ cái, số, `-`, `_`
- Ví dụ: `tndgranite` ✅, `tnd-granite` ✅, `tnd_granite` ✅
- Không được: `tnd granite` ❌, `tnd.granite` ❌

### Connection String không hoạt động
**Kiểm tra**:
1. Đã thay `<username>` và `<password>` chưa?
2. Đã thêm database name (`/tndgranite`) chưa?
3. Password có ký tự đặc biệt? → Cần URL encode
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - `&` → `%26`
   - `+` → `%2B`
   - `=` → `%3D`

**Ví dụ**: Password là `P@ssw0rd#123`
```
mongodb+srv://user:P%40ssw0rd%23123@cluster.mongodb.net/tndgranite
```

---

## 🔒 Bảo Mật Production

### Checklist bảo mật:
- [ ] **Không dùng `0.0.0.0/0`** trong production
- [ ] **Whitelist chỉ IP của server** production
- [ ] **Password mạnh** cho database user (tối thiểu 16 ký tự)
- [ ] **Không commit `.env`** lên Git
- [ ] **Rotate password** định kỳ
- [ ] **Enable MongoDB Atlas monitoring** và alerts
- [ ] **Backup database** định kỳ

### Tạo Database User riêng cho Production
1. Vào **"Database Access"**
2. Tạo user mới với:
   - Username: `tndgranite_prod`
   - Password: Mạnh và ngẫu nhiên
   - Privileges: **"Read and write to any database"** (không cần Atlas admin)
3. Dùng user này cho production

---

## 📊 Monitoring & Alerts

### Setup Alerts trên MongoDB Atlas
1. Vào **"Alerts"** ở menu bên trái
2. Click **"Add Alert"**
3. Chọn các metrics quan trọng:
   - **Connection Count** - Cảnh báo khi có quá nhiều connections
   - **Disk Space** - Cảnh báo khi sắp hết dung lượng
   - **CPU Usage** - Cảnh báo khi CPU cao
   - **Memory Usage** - Cảnh báo khi RAM cao

### Xem Metrics
1. Vào **"Metrics"** trên cluster
2. Xem các thống kê:
   - Connections
   - Operations per second
   - Storage size
   - Network traffic

---

## 💰 Pricing (Free Tier)

### M0 Free Tier bao gồm:
- ✅ **512 MB storage** (đủ cho ~10,000 documents)
- ✅ **Shared RAM** (đủ cho development)
- ✅ **Không giới hạn** database và collections
- ✅ **Không giới hạn** connections
- ✅ **Backup** (7 ngày retention)

### Khi nào cần upgrade:
- Database > 512 MB
- Cần performance tốt hơn
- Cần dedicated resources
- Cần backup lâu hơn

---

## 📝 Tóm Tắt

### Connection String Format:
```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

### Ví dụ hoàn chỉnh:
```
mongodb+srv://tndgranite_admin:MySecurePassword123@tndgranite-cluster.abc123.mongodb.net/tndgranite?retryWrites=true&w=majority
```

### File .env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tndgranite?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=production
```

---

## ✅ Checklist Hoàn Thành

- [ ] Đã tạo tài khoản MongoDB Atlas
- [ ] Đã tạo cluster (M0 Free Tier)
- [ ] Đã tạo database user
- [ ] Đã whitelist IP (hoặc 0.0.0.0/0 cho dev)
- [ ] Đã copy connection string
- [ ] Đã cấu hình .env trong Backend
- [ ] Đã test kết nối thành công
- [ ] Đã seed dữ liệu
- [ ] Đã test API endpoints

**Nếu tất cả đều ✅ → MongoDB Atlas đã sẵn sàng! 🎉**

---

## 📞 Hỗ Trợ

- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com
- **MongoDB Community Forum**: https://developer.mongodb.com/community/forums
- **MongoDB Support**: https://www.mongodb.com/support

---

**Chúc bạn setup thành công! 🚀**

