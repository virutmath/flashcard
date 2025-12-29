# Flashcard Kids Admin Backend

Một backend Node.js/Express.js quản lý nội dung cho ứng dụng Flashcard Kids, với SQLite database tối ưu cho Render deployment.

## ✨ Tính năng

### 🔐 Authentication & Authorization
- JWT-based authentication cho cả admin và user
- 2 loại quyền admin:
  - **Admin**: Toàn quyền (quản lý user, admin user, nhập liệu)
  - **Moderator**: Chỉ nhập liệu (CRUD flashcard, topic, level, badge)

### 👥 Quản lý User
- Đăng ký/Đăng nhập
- Quản lý profile
- Lịch sử bookmarks, badges, streaks

### 📚 Quản lý Content
- **Flashcards**: CRUD flashcard với upload ảnh qua Cloudinary
- **Topics**: Quản lý chủ đề
- **Levels**: Quản lý độ khó
- **Badges**: Quản lý huy hiệu người dùng

### 🎯 Public APIs
- Theo đúng contract OpenAPI
- `/auth/login`, `/auth/logout`
- `/user`, `/bookmarks`, `/streak`, `/badges`
- `/flashcards`, `/topics`, `/levels`

### 🎨 Admin UI
- Giao diện Bootstrap thân thiện
- Dashboard overview
- CRUD cho tất cả entities
- Phân quyền dựa trên role

## 📋 Requirements

- Node.js 14+
- npm hoặc yarn
- Cloudinary account (để upload ảnh)

## 🚀 Installation

```bash
# Clone repository
git clone <repo-url>
cd flashcard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env với thông tin Cloudinary của bạn
nano .env

# Seed database (optional)
npm run seed

# Start server
npm start
```

## 📝 Environment Variables

```env
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Database
DATABASE_PATH=./database/flashcard.sqlite

# Default Admin
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```

## 🔐 Bảo mật

- ✅ File SQLite không public qua web (middleware protection)
- ✅ Sensitive credentials trong `.env` (không commit)
- ✅ JWT token xác thực
- ✅ Password hash với bcrypt
- ✅ Foreign key constraints
- ✅ Role-based access control

## 📂 Project Structure

```
/src
  /config          - Cấu hình (database, config)
  /controllers     - Request handlers
  /models          - Database models
  /routes          - API routes
  /middlewares     - Auth & authorization
  /utils           - Helper services
  app.js          - Express app entry point

/public/admin
  login.html       - Admin login page
  dashboard.html   - Admin dashboard
  /js
    dashboard.js   - Frontend logic

/database
  flashcard.sqlite - SQLite database

/scripts
  seed.js         - Database seeding script
```

## 🔌 API Endpoints

### Public APIs
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/user                 (requires auth)
GET    /api/bookmarks             (requires auth)
PUT    /api/bookmarks             (requires auth)
GET    /api/streak               (requires auth)
GET    /api/badges               (requires auth)
GET    /api/flashcards
GET    /api/topics
GET    /api/levels
```

### Admin APIs
```
POST   /api/admin/auth/login
POST   /api/admin/auth/logout

# Admin Users (admin only)
GET    /api/admin/admin-users
POST   /api/admin/admin-users
PUT    /api/admin/admin-users/:id
DELETE /api/admin/admin-users/:id
PUT    /api/admin/admin-users/:id/password

# User Management (admin only)
GET    /api/admin/users
DELETE /api/admin/users/:id

# Flashcards (admin/moderator)
GET    /api/admin/flashcards
POST   /api/admin/flashcards
PUT    /api/admin/flashcards/:id
DELETE /api/admin/flashcards/:id
POST   /api/admin/flashcards/:id/upload-image

# Topics (admin/moderator)
GET    /api/admin/topics
POST   /api/admin/topics
PUT    /api/admin/topics/:id
DELETE /api/admin/topics/:id

# Levels (admin/moderator)
GET    /api/admin/levels
POST   /api/admin/levels
PUT    /api/admin/levels/:id
DELETE /api/admin/levels/:id

# Badges (admin/moderator)
GET    /api/admin/badges
POST   /api/admin/badges
PUT    /api/admin/badges/:id
DELETE /api/admin/badges/:id
POST   /api/admin/badges/:id/assign
DELETE /api/admin/badges/:id/unassign
```

## 🎯 Quick Start

1. **Start server**
   ```bash
   npm start
   ```

2. **Access Admin UI**
   - Mở: `http://localhost:3000/admin/login.html`
   - Username: `admin`
   - Password: `admin123` (đổi ngay sau lần đầu!)

3. **Test Public API**
   ```bash
   curl http://localhost:3000/api/flashcards
   ```

## 🧪 Development

```bash
# Watch mode
npm run dev

# Test API endpoints
curl -X GET http://localhost:3000/api/flashcards
```

## 🚢 Deployment on Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Environment variables:
   - Thiết lập tất cả `.env` variables trong Render dashboard
   - Bật "Auto-Deploy" khi push

5. Render sẽ tự động:
   - Install dependencies
   - Run server
   - Expose port 3000

## ⚠️ Important Notes

- Database file (`flashcard.sqlite`) được lưu tại `/database/`
- File này tự động tạo khi server start
- Trên Render, database sẽ nằm trong ephemeral disk (không persistent)
- Nếu cần persistent storage, xem xét dùng PostgreSQL trên Render

## 📞 Support

Liên hệ development team nếu có vấn đề.

---

**Created with ❤️ for Flashcard Kids**
