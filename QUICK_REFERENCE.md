# Quick Reference - Flashcard Admin Backend

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env với Cloudinary credentials

# 3. Seed sample data (optional)
npm run seed

# 4. Start
npm start

# 5. Access
# Admin UI: http://localhost:3000/admin/login.html
# API: http://localhost:3000/api
```

## 📋 Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| PORT | No | 3000 |
| NODE_ENV | No | development |
| JWT_SECRET | Yes | your_secret_key |
| CLOUDINARY_CLOUD_NAME | Yes | your_cloud |
| CLOUDINARY_API_KEY | Yes | api_key |
| CLOUDINARY_API_SECRET | Yes | api_secret |
| DATABASE_PATH | No | ./database/flashcard.sqlite |
| DEFAULT_ADMIN_USERNAME | No | admin |
| DEFAULT_ADMIN_PASSWORD | No | admin123 |

## 🔐 Default Credentials

```
Username: admin
Password: admin123
```

⚠️ **Change after first login!**

## 📁 Project Structure

```
/src
  /config         - Database & app config
  /controllers    - API handlers
  /models         - Database models
  /routes         - API routes (public & admin)
  /middlewares    - Auth & security
  /utils          - Services (Auth, Cloudinary)
  app.js          - Main Express app

/public/admin
  login.html      - Admin login page
  dashboard.html  - Admin dashboard
  /js
    dashboard.js  - Frontend logic

/database
  flashcard.sqlite - Database (auto-created)
```

## 📊 Database Schema

### Tables:
- `admin_users` - Admin accounts (admin/moderator)
- `users` - App users
- `topics` - Flashcard topics
- `levels` - Difficulty levels
- `flashcards` - Flashcard data
- `badges` - Badge definitions
- `user_badges` - User badge assignments (M2M)
- `bookmarks` - User bookmarks (M2M)
- `streaks` - User streak tracking

## 🔌 API Endpoints Summary

### Public (No Auth)
```
GET  /api/flashcards          - List flashcards
GET  /api/topics              - List topics
GET  /api/levels              - List levels
POST /api/auth/login          - User login
```

### Public (With Auth)
```
GET  /api/user                - Get user profile
GET  /api/bookmarks           - Get bookmarks
PUT  /api/bookmarks           - Update bookmarks
GET  /api/streak              - Get streak
GET  /api/badges              - Get badges
POST /api/auth/logout         - Logout
```

### Admin (Admin Only)
```
GET    /api/admin/admin-users             - List admin users
POST   /api/admin/admin-users             - Create admin user
PUT    /api/admin/admin-users/:id         - Update admin user
DELETE /api/admin/admin-users/:id         - Delete admin user

GET    /api/admin/users                   - List app users
PUT    /api/admin/users/:id               - Update user
DELETE /api/admin/users/:id               - Delete user
```

### Admin (Admin/Moderator)
```
GET    /api/admin/flashcards              - List flashcards
POST   /api/admin/flashcards              - Create flashcard
PUT    /api/admin/flashcards/:id          - Update flashcard
DELETE /api/admin/flashcards/:id          - Delete flashcard
POST   /api/admin/flashcards/:id/upload-image - Upload image

GET    /api/admin/topics                  - List topics
POST   /api/admin/topics                  - Create topic
PUT    /api/admin/topics/:id              - Update topic
DELETE /api/admin/topics/:id              - Delete topic

GET    /api/admin/levels                  - List levels
POST   /api/admin/levels                  - Create level
PUT    /api/admin/levels/:id              - Update level
DELETE /api/admin/levels/:id              - Delete level

GET    /api/admin/badges                  - List badges
POST   /api/admin/badges                  - Create badge
PUT    /api/admin/badges/:id              - Update badge
DELETE /api/admin/badges/:id              - Delete badge
POST   /api/admin/badges/:id/assign       - Assign to user
DELETE /api/admin/badges/:id/unassign     - Remove from user
```

## 🔒 Authentication

### Token Format
```
Authorization: Bearer <jwt_token>
```

### Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Response
```json
{
  "token": "eyJhbGci...",
  "admin": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

## 🎨 Admin UI Features

- Dashboard: Overview statistics
- Users: CRUD user management
- Admin Users: Manage admin accounts (admin only)
- Flashcards: CRUD with image upload
- Topics: Manage topics
- Levels: Manage levels
- Badges: Manage badges & assignments

## 🛡️ Security Features

✅ JWT Authentication
✅ Role-based Authorization (Admin/Moderator)
✅ Password Hashing (bcrypt)
✅ Rate Limiting
✅ File Access Protection
✅ Environment Variables
✅ HTTPS Ready (Render)
✅ SQL Injection Prevention (prepared statements)

## 📤 Image Upload (Cloudinary)

```bash
# Upload ảnh cho flashcard
curl -X POST http://localhost:3000/api/admin/flashcards/fc_001/upload-image \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/image.jpg"

# Response
{
  "imageUrl": "https://res.cloudinary.com/..."
}
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:3000/health

# Get flashcards
curl http://localhost:3000/api/flashcards

# Admin login
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Watch mode with nodemon
```

### Production (Render)
```
1. Push to GitHub
2. Create Web Service on Render
3. Set environment variables
4. Deploy automatically
```

See `RENDER_DEPLOYMENT.md` for detailed guide.

## 📚 Documentation Files

- **README.md** - Full project documentation
- **CLOUDINARY_GUIDE.md** - Image upload setup
- **RENDER_DEPLOYMENT.md** - Deployment instructions
- **validate.sh** - Project structure validation

## 🆘 Common Issues

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Database locked error
```bash
# Delete database and restart
rm database/flashcard.sqlite
npm start
npm run seed
```

### Cloudinary upload fails
- Check credentials in .env
- Verify account active
- Check file size/format

### Admin can't login
- Verify database created (check if login.html loads)
- Check console errors
- Try default credentials: admin/admin123

## 📞 Support Resources

- Node.js: https://nodejs.org/docs
- Express: https://expressjs.com
- SQLite: https://www.sqlite.org/docs.html
- Cloudinary: https://cloudinary.com/documentation
- Render: https://render.com/docs
- JWT: https://jwt.io

---

**Built with ❤️ for Flashcard Kids**
