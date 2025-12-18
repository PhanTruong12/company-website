# 🔧 Fix CORS Error: Access-Control-Allow-Origin

## ❌ Lỗi bạn đang gặp:
```
Access to XMLHttpRequest at 'http://localhost:5000/api/wall-positions' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 🔍 Nguyên nhân:
- Backend đang chạy với `NODE_ENV=production` trong `.env`
- CORS chỉ cho phép origins trong `ALLOWED_ORIGINS` (chỉ có production URL)
- `http://localhost:5173` không có trong danh sách allowed origins

## ✅ Đã sửa:
- CORS đã được cập nhật để **luôn cho phép localhost** trong mọi trường hợp
- Không cần thay đổi `.env` file

## 🔄 Cách áp dụng:

### Bước 1: Restart Backend Server

1. **Dừng backend server hiện tại:**
   - Tìm terminal đang chạy backend
   - Nhấn `Ctrl + C`

2. **Khởi động lại:**
   ```bash
   cd Backend
   npm run dev
   ```

### Bước 2: Kiểm tra CORS đã hoạt động

Sau khi restart, test từ browser:
- Mở: `http://localhost:5000/api/wall-positions`
- Should return JSON data
- Không còn CORS error

### Bước 3: Clear Browser Cache

1. Mở Developer Tools (F12)
2. Right-click vào Refresh button
3. Chọn **"Empty Cache and Hard Reload"**
4. Hoặc thử **Incognito/Private window**

## ✅ Kiểm tra:

Sau khi restart, bạn sẽ thấy trong backend logs:
```
Server đang chạy trên cổng: 5000
```

Và khi frontend gọi API, không còn CORS error nữa.

## 📝 Lưu ý:

- **Localhost luôn được cho phép** - không cần thay đổi `.env`
- **Production URLs** vẫn được kiểm tra từ `ALLOWED_ORIGINS`
- **Development** - tất cả origins đều được cho phép

## 🔍 Debug:

Nếu vẫn còn lỗi sau khi restart:

1. **Kiểm tra backend logs:**
   - Xem có CORS warning không
   - Xem có lỗi gì khác không

2. **Kiểm tra browser console:**
   - Mở Developer Tools (F12)
   - Tab Console → Xem lỗi chi tiết
   - Tab Network → Xem request/response headers

3. **Test API trực tiếp:**
   ```bash
   curl -H "Origin: http://localhost:5173" http://localhost:5000/api/wall-positions
   ```

