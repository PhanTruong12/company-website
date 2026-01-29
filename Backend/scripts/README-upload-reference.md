# Upload Reference Images to Cloudinary

Script để upload ảnh tham chiếu (reference images) lên Cloudinary cho tính năng mô phỏng.

## Yêu cầu

1. Cloudinary credentials đã được cấu hình trong `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

2. Ảnh reference cần upload (kitchen, stairs, etc.)

## Cách sử dụng

### Option 1: Upload một ảnh

```bash
# Tự động detect scene type từ tên file
npm run upload:reference ./path/to/kitchen-reference.jpg

# Hoặc chỉ định scene type
npm run upload:reference ./path/to/image.jpg kitchen
npm run upload:reference ./path/to/image.jpg stairs
```

### Option 2: Upload nhiều ảnh cùng lúc

```bash
npm run upload:reference ./kitchen.jpg ./stairs.jpg
```

### Option 3: Sử dụng trực tiếp với node

```bash
node scripts/upload-reference-images.js ./reference-images/kitchen.jpg kitchen
```

## Output

Script sẽ hiển thị:
- ✅ URL Cloudinary sau khi upload thành công
- 📝 Dòng cấu hình để thêm vào `frontend/.env`

Ví dụ output:
```
✅ Upload successful!

📋 Cloudinary URL:
   https://res.cloudinary.com/your-cloud/image/upload/v1234567890/tndgranite/reference-images/kitchen-reference.jpg

📝 Add to frontend/.env:
   VITE_KITCHEN_REFERENCE_URL=https://res.cloudinary.com/your-cloud/image/upload/v1234567890/tndgranite/reference-images/kitchen-reference.jpg
```

## Sau khi upload

1. Copy URL từ output
2. Thêm vào `frontend/.env`:
   ```env
   VITE_KITCHEN_REFERENCE_URL=<cloudinary-url>
   VITE_STAIRS_REFERENCE_URL=<cloudinary-url>
   ```
3. Restart frontend dev server để load env variables mới

## Lưu ý

- Ảnh sẽ được upload vào folder: `tndgranite/reference-images/`
- Public ID format: `tndgranite/reference-images/{scene-type}-reference`
- Script sẽ overwrite nếu ảnh đã tồn tại (cùng public_id)
- Chất lượng ảnh: `auto:best` (tự động tối ưu)
- Format: `auto` (WebP nếu browser hỗ trợ)

