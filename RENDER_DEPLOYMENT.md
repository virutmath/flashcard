# Deployment Guide - Render

## 🚀 Deployment Steps

### 1. Chuẩn bị Repository

```bash
# Đảm bảo code đã commit và push lên GitHub
git add .
git commit -m "Initial commit: Flashcard Admin Backend"
git push origin main
```

### 2. Tạo Account Render
- Truy cập: https://render.com
- Sign up với GitHub account
- Grant permissions

### 3. Tạo New Web Service

#### Step 1: Connect Repository
- Dashboard → New +
- Select "Web Service"
- Connect GitHub
- Choose repository: `flashcard`
- Tìm và chọn repository

#### Step 2: Configure Service
- **Name**: `flashcard-admin-backend`
- **Environment**: `Node`
- **Build Command**: 
  ```
  npm install
  ```
- **Start Command**: 
  ```
  npm start
  ```
- **Instance Type**: `Free` (hoặc Starter tùy nhu cầu)

#### Step 3: Environment Variables
Click "Environment" → Add From File / Add Variable

Thêm các variables:
```
PORT=3000
NODE_ENV=production

JWT_SECRET=your_very_secure_random_secret_here_change_this
JWT_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

DATABASE_PATH=./database/flashcard.sqlite

DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=your_secure_password
```

⚠️ **IMPORTANT**: Thay đổi JWT_SECRET và password thành giá trị mạnh!

#### Step 4: Deploy
- Click "Create Web Service"
- Render sẽ tự động build & deploy
- Chờ "Deployed" status (2-5 phút)

### 4. Verify Deployment

```bash
# Get deployed URL (https://flashcard-admin-backend.onrender.com)
curl https://flashcard-admin-backend.onrender.com/health

# Response:
# {"status":"ok"}
```

### 5. Access Admin UI

```
https://flashcard-admin-backend.onrender.com/admin/login.html

Username: admin
Password: [từ DEFAULT_ADMIN_PASSWORD]
```

## ⚠️ Important Notes

### Database Persistence
- Render sử dụng **ephemeral storage**
- SQLite file sẽ bị xóa khi redeploy/restart
- **Solutions**:
  1. **Recommended**: Dùng PostgreSQL (Render hỗ trợ)
  2. **Alternative**: Setup backup script
  3. **Dev only**: Accept database loss

### Recommended Architecture (Production)
```
┌─────────────────────┐
│  GitHub Repository  │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Render Web Service │
│  (Node.js Backend)  │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ PostgreSQL Database │
│ (Render Postgres)   │
└─────────────────────┘
```

### Setup PostgreSQL (Optional)
1. Render Dashboard → New Database → PostgreSQL
2. Lấy connection string
3. Update app.js để dùng PostgreSQL thay SQLite
4. Deploy lại

## 📊 Monitoring

### View Logs
- Render Dashboard → Your App → Logs
- Real-time logs từ server

### Analytics
- Requests/sec
- Response time
- Error rate
- Disk usage

## 🔄 Auto Deploy

- Render tự động redeploy khi push lên GitHub
- Trigger: Cứ `git push origin main`
- Status xem ở Render Dashboard

## 📈 Scaling

### Nếu cần upgrade:
1. Render Dashboard → Settings
2. Change "Instance Type":
   - Free → Starter: $7/month
   - Starter → Pro: $25/month

### Tối ưu performance:
- Enable "Auto-scaling" (paid plans)
- Optimize database queries
- Use CDN cho static files (Cloudinary)

## 🔑 Security on Render

✅ **HTTPS**: Tự động (*.onrender.com)
✅ **Environment Variables**: Private (không public)
✅ **No .env file**: Không upload lên Render

### Best Practices:
1. Thay đổi DEFAULT_ADMIN_PASSWORD sau deploy
2. Rotate JWT_SECRET định kỳ
3. Monitor logs cho suspicious activity
4. Backup database định kỳ

## 🆘 Troubleshooting

### Build fails?
```
- Check "Logs" tab
- Verify package.json
- Check Node version (14+)
```

### App crashes after deploy?
```
- View error logs
- Check environment variables set correctly
- Verify all dependencies installed (npm install)
```

### Database empty after redeploy?
```
- Expected behavior (ephemeral storage)
- Run: npm run seed (nếu cần sample data)
- Consider PostgreSQL solution
```

### Can't connect to admin?
```
- Check HTTPS URL (not HTTP)
- Verify network/firewall
- Clear browser cache
```

## 📞 Support

- Render Docs: https://render.com/docs
- Render Dashboard: https://dashboard.render.com

---

**Happy Deploying! 🎉**
