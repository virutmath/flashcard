# Cloudinary Integration Guide

## 🎯 Overview

Hệ thống Flashcard Admin sử dụng Cloudinary để lưu trữ ảnh minh họa (flashcard images). Ảnh được upload lên Cloudinary, và server chỉ lưu URL của ảnh trong SQLite database.

## 📋 Quy Trình

```
Admin UI → Upload Image File
    ↓
Express Server
    ↓
Cloudinary API
    ↓
Return Image URL
    ↓
Save URL to SQLite
```

## 🔑 Setup Cloudinary

### 1. Tạo Cloudinary Account
- Truy cập: https://cloudinary.com/users/register/free
- Sign up với email
- Xác nhận email

### 2. Lấy Credentials
- Vào Dashboard: https://cloudinary.com/console/
- Tìm "Product Environment Credentials"
- Ghi lại:
  - **Cloud Name**
  - **API Key**
  - **API Secret**

### 3. Cấu hình .env
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 📤 Upload Ảnh via Admin UI

### Flow:
1. Vào Admin Dashboard → Flashcards
2. Click "Thêm Flashcard" hoặc "Sửa"
3. Upload ảnh qua form
4. Server gửi tới Cloudinary
5. Nhận URL ảnh lại
6. Lưu URL vào database

### API Endpoint:
```
POST /api/admin/flashcards/:id/upload-image
Content-Type: multipart/form-data

Body:
- image: [file]

Response:
{
  "imageUrl": "https://res.cloudinary.com/..."
}
```

## 🔒 Security Notes

- API Secret được lưu trữ server-side (không expose client)
- Upload chỉ cho phép từ admin (authentication required)
- File upload bị giới hạn kích thước (multer config)
- Ảnh được organized trong folder `flashcard` trên Cloudinary

## 📝 CloudinaryService Usage

```javascript
const CloudinaryService = require('./utils/CloudinaryService');

// Upload ảnh
const imageUrl = await CloudinaryService.uploadImage(
  '/path/to/file',
  'flashcard_fc_001'
);

// Delete ảnh
await CloudinaryService.deleteImage('flashcard_fc_001');
```

## 💡 Best Practices

1. **Optimize Images**
   - Compressed images để tiết kiệm storage/bandwidth
   - Cloudinary tự động optimize
   - Sử dụng responsive images

2. **Naming Convention**
   - `flashcard_[flashcard_id]` để dễ track

3. **Error Handling**
   - Kiểm tra response từ Cloudinary
   - Retry logic nếu upload fail
   - Log errors for debugging

4. **Cost Optimization**
   - Free tier: 25GB storage, 25GB/month bandwidth
   - Xem: https://cloudinary.com/pricing

## 🚀 Cloudinary Features Có Thể Dùng

- **Image Transformation**: Resize, crop, compress
- **CDN**: Global delivery (fast loading)
- **URL Generation**: Dynamic URLs với parameters
- **Bulk Upload**: Upload nhiều ảnh một lúc

## 🔧 Troubleshooting

### Upload fail?
- Check API credentials trong .env
- Verify Cloudinary account active
- Kiểm tra file size/format

### Image không hiển thị?
- Verify URL trong database
- Check Cloudinary dashboard
- Test URL trực tiếp browser

### Rate limit?
- Cloudinary free tier có limit rate
- Nâng cấp plan nếu cần

---

**Reference**: https://cloudinary.com/documentation
