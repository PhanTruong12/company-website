# Hướng Dẫn Migrate Database Lên MongoDB Atlas

Hướng dẫn chi tiết cách migrate database từ local MongoDB hoặc import dữ liệu lên MongoDB Atlas.

## 📋 Mục Lục

1. [Chuẩn Bị](#chuẩn-bị)
2. [Export Database từ Local MongoDB](#export-database-từ-local-mongodb)
3. [Import vào MongoDB Atlas](#import-vào-mongodb-atlas)
4. [Migrate bằng MongoDB Compass](#migrate-bằng-mongodb-compass)
5. [Migrate bằng mongodump/mongorestore](#migrate-bằng-mongodumpmongorestore)
6. [Kiểm Tra Sau Khi Migrate](#kiểm-tra-sau-khi-migrate)

---

## 🚀 Chuẩn Bị

### Yêu cầu:
- ✅ MongoDB Atlas đã được setup (xem `MONGODB_ATLAS_SETUP.md`)
- ✅ Connection string từ Atlas
- ✅ MongoDB Compass (khuyến nghị) hoặc mongodump/mongorestore
- ✅ Local MongoDB đang chạy (nếu migrate từ local)

### Download MongoDB Compass:
- **Windows/Mac/Linux**: https://www.mongodb.com/try/download/compass
- Hoặc dùng MongoDB Shell (mongosh)

---

## 📤 Export Database Từ Local MongoDB

### Option 1: Sử dụng MongoDB Compass (Dễ nhất)

#### Bước 1: Kết nối Local MongoDB
1. Mở MongoDB Compass
2. Connection String: `mongodb://localhost:27017`
3. Click **"Connect"**

#### Bước 2: Export Collections
1. Chọn database `tndgranite`
2. Với mỗi collection cần export:
   - Click vào collection (ví dụ: `interiorimages`)
   - Click icon **"Export Collection"** (hoặc menu → Export Collection)
   - Chọn format: **JSON** hoặc **CSV**
   - Chọn file location
   - Click **"Export"**

**Collections cần export:**
- `interiorimages` (hoặc `interiorimages`)
- `stonetypes`
- `interiortypes`
- `admins`
- `products` (nếu có)

#### Bước 3: Lưu các file export
Lưu các file vào một thư mục, ví dụ:
```
exports/
  ├── interiorimages.json
  ├── stonetypes.json
  ├── interiortypes.json
  └── admins.json
```

---

### Option 2: Sử dụng mongodump (Command Line)

#### Bước 1: Cài đặt MongoDB Database Tools
- **Windows**: https://www.mongodb.com/try/download/database-tools
- **Mac**: `brew install mongodb-database-tools`
- **Linux**: `sudo apt-get install mongodb-database-tools`

#### Bước 2: Export database
```bash
# Export toàn bộ database
mongodump --uri="mongodb://localhost:27017/tndgranite" --out=./backup

# Hoặc export từng collection
mongodump --uri="mongodb://localhost:27017/tndgranite" \
  --collection=interiorimages \
  --out=./backup
```

Kết quả sẽ có trong thư mục `backup/tndgranite/`

---

## 📥 Import Vào MongoDB Atlas

### Option 1: Sử dụng MongoDB Compass (Khuyến nghị)

#### Bước 1: Kết nối MongoDB Atlas
1. Mở MongoDB Compass
2. Connection String từ Atlas:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/tndgranite?retryWrites=true&w=majority
   ```
3. Thay `username` và `password` bằng thông tin của bạn
4. Click **"Connect"**

#### Bước 2: Import Collections
1. Chọn database `tndgranite` (hoặc tạo mới nếu chưa có)
2. Với mỗi collection cần import:
   - Click **"Create Collection"** (nếu chưa có)
   - Tên collection: `interiorimages` (hoặc tên tương ứng)
   - Click vào collection
   - Click **"Import Collection"** (hoặc menu → Import Collection)
   - Chọn file JSON đã export
   - Click **"Import"**

#### Bước 3: Kiểm tra dữ liệu
- Xem số documents trong mỗi collection
- Click vào collection để xem dữ liệu

---

### Option 2: Sử dụng mongorestore (Command Line)

#### Bước 1: Restore toàn bộ database
```bash
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/tndgranite" \
  ./backup/tndgranite
```

#### Bước 2: Restore từng collection
```bash
# Restore interiorimages
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/tndgranite" \
  --collection=interiorimages \
  ./backup/tndgranite/interiorimages.bson

# Restore stonetypes
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/tndgranite" \
  --collection=stonetypes \
  ./backup/tndgranite/stonetypes.bson

# Restore admins
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/tndgranite" \
  --collection=admins \
  ./backup/tndgranite/admins.bson
```

---

### Option 3: Sử dụng mongoimport (Cho file JSON)

#### Bước 1: Import từ file JSON
```bash
# Import interiorimages
mongoimport --uri="mongodb+srv://username:password@cluster.mongodb.net/tndgranite" \
  --collection=interiorimages \
  --file=./exports/interiorimages.json \
  --jsonArray

# Import stonetypes
mongoimport --uri="mongodb+srv://username:password@cluster.mongodb.net/tndgranite" \
  --collection=stonetypes \
  --file=./exports/stonetypes.json \
  --jsonArray

# Import admins
mongoimport --uri="mongodb+srv://username:password@cluster.mongodb.net/tndgranite" \
  --collection=admins \
  --file=./exports/admins.json \
  --jsonArray
```

**Lưu ý**: 
- `--jsonArray` nếu file JSON là array `[{...}, {...}]`
- Bỏ `--jsonArray` nếu file JSON là từng document trên mỗi dòng

---

## 🔄 Migrate Bằng MongoDB Compass (Step-by-Step)

### Bước 1: Export từ Local

1. **Kết nối Local MongoDB:**
   ```
   mongodb://localhost:27017
   ```

2. **Export mỗi collection:**
   - Vào database `tndgranite`
   - Click collection → **"Export Collection"**
   - Format: **JSON**
   - Save as: `interiorimages.json`, `stonetypes.json`, etc.

### Bước 2: Import vào Atlas

1. **Kết nối MongoDB Atlas:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/tndgranite
   ```

2. **Tạo database và collections:**
   - Database: `tndgranite`
   - Collections: `interiorimages`, `stonetypes`, `interiortypes`, `admins`

3. **Import từng collection:**
   - Click collection → **"Import Collection"**
   - Chọn file JSON đã export
   - Click **"Import"**

### Bước 3: Verify

- Kiểm tra số documents trong mỗi collection
- So sánh với local database

---

## 🔧 Migrate Bằng mongodump/mongorestore

### Full Migration Script

Tạo file `migrate-to-atlas.sh`:

```bash
#!/bin/bash

# Configuration
LOCAL_URI="mongodb://localhost:27017/tndgranite"
ATLAS_URI="mongodb+srv://username:password@cluster.mongodb.net/tndgranite"
BACKUP_DIR="./backup"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting migration to MongoDB Atlas...${NC}\n"

# Step 1: Export from local
echo -e "${YELLOW}📤 Step 1: Exporting from local MongoDB...${NC}"
mongodump --uri="$LOCAL_URI" --out="$BACKUP_DIR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Export successful!${NC}\n"
else
    echo -e "${RED}❌ Export failed!${NC}"
    exit 1
fi

# Step 2: Import to Atlas
echo -e "${YELLOW}📥 Step 2: Importing to MongoDB Atlas...${NC}"
mongorestore --uri="$ATLAS_URI" "$BACKUP_DIR/tndgranite"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Import successful!${NC}\n"
else
    echo -e "${RED}❌ Import failed!${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Migration completed successfully!${NC}"
```

**Chạy script:**
```bash
chmod +x migrate-to-atlas.sh
./migrate-to-atlas.sh
```

---

## 🧪 Kiểm Tra Sau Khi Migrate

### 1. Kiểm tra trên MongoDB Atlas Dashboard

1. Vào **"Database"** → **"Browse Collections"**
2. Kiểm tra:
   - ✅ Database `tndgranite` tồn tại
   - ✅ Tất cả collections có dữ liệu
   - ✅ Số documents đúng

### 2. Kiểm tra từ Backend

#### Cập nhật .env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tndgranite?retryWrites=true&w=majority
```

#### Test kết nối:
```bash
cd Backend
npm run dev
```

Kiểm tra console:
```
MongoDB Connected: cluster-shard-00-00.xxxxx.mongodb.net:27017
```

#### Test API:
```bash
# Test Stone Types
curl http://localhost:5000/api/stone-types

# Test Interior Images
curl http://localhost:5000/api/interior-images

# Test Admin Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tndgranite.com","password":"admin123"}'
```

### 3. So sánh dữ liệu

**Local:**
```bash
mongosh mongodb://localhost:27017/tndgranite
> db.interiorimages.countDocuments()
> db.stonetypes.countDocuments()
```

**Atlas:**
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/tndgranite"
> db.interiorimages.countDocuments()
> db.stonetypes.countDocuments()
```

Số lượng phải giống nhau!

---

## 🔄 Migrate Hình Ảnh (Uploads)

### Vấn đề:
- Hình ảnh được lưu trong `Backend/uploads/interior-images/`
- Cần upload lên server khi deploy

### Giải pháp:

#### Option 1: Upload lên Cloud Storage (Khuyến nghị)
- **Cloudinary** ⭐ (Khuyến nghị - Dễ setup, có CDN tự động, free tier 25GB)
  - Xem hướng dẫn chi tiết: `CLOUDINARY_SETUP.md`
- **AWS S3** (Cần setup phức tạp hơn, nhưng linh hoạt)
- **Google Cloud Storage** (Tương tự AWS S3)
- **Azure Blob Storage** (Nếu dùng Azure)

#### Option 2: Sync với Server
```bash
# Sử dụng rsync hoặc scp
rsync -avz Backend/uploads/ user@server:/path/to/uploads/
```

#### Option 3: Giữ nguyên local và sync
- Nếu deploy lên VPS, copy thư mục `uploads/` lên server
- Đảm bảo đường dẫn `/uploads` hoạt động trên server

---

## 📝 Checklist Migration

### Trước khi migrate:
- [ ] Đã backup local database
- [ ] Đã setup MongoDB Atlas
- [ ] Đã có connection string
- [ ] Đã whitelist IP (hoặc 0.0.0.0/0)

### Trong khi migrate:
- [ ] Export thành công từ local
- [ ] Import thành công vào Atlas
- [ ] Không có lỗi trong quá trình import

### Sau khi migrate:
- [ ] Kiểm tra số documents đúng
- [ ] Test API endpoints
- [ ] Test admin login
- [ ] Test CRUD operations
- [ ] Cập nhật .env với Atlas connection string
- [ ] Test ứng dụng end-to-end

---

## 🐛 Troubleshooting

### Lỗi: "Authentication failed"
**Nguyên nhân**: Username/password sai
**Giải pháp**: Kiểm tra lại connection string

### Lỗi: "IP not whitelisted"
**Nguyên nhân**: IP chưa được whitelist
**Giải pháp**: Vào Network Access → Add IP Address

### Lỗi: "Collection already exists"
**Nguyên nhân**: Collection đã có dữ liệu
**Giải pháp**: 
- Xóa collection cũ trước khi import
- Hoặc dùng `--drop` flag:
```bash
mongorestore --uri="..." --drop ./backup/tndgranite
```

### Lỗi: "Duplicate key error"
**Nguyên nhân**: Document với cùng _id đã tồn tại
**Giải pháp**: 
- Xóa collection trước khi import
- Hoặc dùng `--drop` flag

### Import chậm
**Nguyên nhân**: Dữ liệu lớn hoặc network chậm
**Giải pháp**: 
- Chia nhỏ import (từng collection)
- Import vào giờ off-peak
- Tăng timeout nếu cần

---

## 💡 Tips & Best Practices

### 1. Backup trước khi migrate
```bash
# Backup local database
mongodump --uri="mongodb://localhost:27017/tndgranite" --out=./backup-before-migrate
```

### 2. Test trên staging trước
- Tạo cluster riêng cho staging
- Test migration trên staging
- Sau đó mới migrate production

### 3. Migrate vào giờ off-peak
- Tránh giờ cao điểm
- Đảm bảo không ảnh hưởng users

### 4. Verify sau khi migrate
- So sánh số documents
- Test các chức năng quan trọng
- Monitor errors trong vài ngày đầu

### 5. Giữ local backup
- Giữ backup local database
- Phòng trường hợp cần rollback

---

## ✅ Quick Migration Commands

### Export từ Local:
```bash
mongodump --uri="mongodb://localhost:27017/tndgranite" --out=./backup
```

### Import vào Atlas:
```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/tndgranite" \
  --drop \
  ./backup/tndgranite
```

### Verify:
```bash
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/tndgranite"
> db.interiorimages.countDocuments()
> db.stonetypes.countDocuments()
```

---

## 🎯 Tóm Tắt

### Cách nhanh nhất (MongoDB Compass):
1. Export từ local → JSON files
2. Import vào Atlas → Từ JSON files
3. Verify trên Atlas dashboard

### Cách tự động (Command Line):
1. `mongodump` từ local
2. `mongorestore` vào Atlas
3. Verify bằng mongosh

### Sau khi migrate:
1. Cập nhật `.env` với Atlas connection string
2. Test API endpoints
3. Test admin panel
4. Deploy lên production

---

**Chúc bạn migrate thành công! 🚀**

