# Cấu hình hiển thị ảnh

## Vấn đề

Ảnh được upload từ production chỉ nằm trên database production. Frontend cần được cấu hình đúng để hiển thị ảnh từ backend production.

## Giải pháp

### 1. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `frontend/` với nội dung:

```env
# Backend API URL (production)
VITE_API_BASE_URL=https://your-backend-domain.com/api

# Hoặc nếu backend chạy trên cùng domain:
# VITE_API_BASE_URL=/api
```

**Lưu ý:**
- Nếu backend và frontend chạy trên cùng domain, có thể dùng relative path `/api`
- Nếu backend chạy trên domain/subdomain khác, phải dùng full URL
- Sau khi thay đổi `.env`, cần rebuild frontend

### 2. Các loại URL ảnh được hỗ trợ

#### a) Cloudinary URL (khuyến nghị cho production)
- URL có dạng: `https://res.cloudinary.com/...`
- Tự động được nhận diện và sử dụng trực tiếp
- Không cần cấu hình thêm

#### b) Local Storage URL
- URL có dạng: `/uploads/interior-images/filename.jpg`
- Frontend sẽ tự động thêm backend base URL
- Ví dụ: `https://your-backend-domain.com/uploads/interior-images/filename.jpg`

### 3. Cấu hình Backend

Backend tự động chọn giữa Cloudinary và Local Storage:

- **Nếu có Cloudinary credentials** (trong `.env` của backend):
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  → Sử dụng Cloudinary (ảnh được lưu trên Cloudinary)

- **Nếu không có Cloudinary credentials**:
  → Sử dụng Local Storage (ảnh được lưu trong `Backend/uploads/interior-images/`)

### 4. Kiểm tra cấu hình

1. Mở Developer Tools (F12)
2. Vào tab Console
3. Trong development mode, sẽ thấy log:
   ```
   [getImageUrl] Constructed URL: {
     original: "/uploads/interior-images/...",
     backendBase: "https://your-backend-domain.com",
     final: "https://your-backend-domain.com/uploads/interior-images/..."
   }
   ```
4. Vào tab Network, kiểm tra request ảnh có trả về 200 OK không

### 5. Troubleshooting

#### Ảnh không hiển thị

1. **Kiểm tra CORS**: Backend phải cho phép frontend domain truy cập
2. **Kiểm tra URL**: Xem Network tab, URL ảnh có đúng không
3. **Kiểm tra file tồn tại**: 
   - Nếu dùng Local Storage: file phải tồn tại trong `Backend/uploads/interior-images/`
   - Nếu dùng Cloudinary: kiểm tra URL trên Cloudinary dashboard
4. **Kiểm tra environment variable**: Đảm bảo `VITE_API_BASE_URL` được set đúng

#### Lỗi CORS

Thêm frontend domain vào `ALLOWED_ORIGINS` trong backend `.env`:
```env
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

### 6. Migration từ Local Storage sang Cloudinary

Nếu muốn chuyển ảnh từ local storage sang Cloudinary:

1. Cấu hình Cloudinary credentials trong backend `.env`
2. Chạy script migration:
   ```bash
   cd Backend
   node src/utils/migrateToCloudinary.js
   ```

Sau khi migration, tất cả ảnh mới sẽ được upload lên Cloudinary, và URL trong database sẽ được cập nhật.

