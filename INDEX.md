# 🎓 Flashcard Admin Backend - Complete Project

## 📖 Documentation Index

Welcome! This document provides a quick navigation to all project documentation and resources.

### 🚀 **Start Here**
1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick API reference & common commands
2. **[README.md](README.md)** - Complete project documentation
3. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built

### 📚 **Setup & Configuration**
- **[.env.example](.env.example)** - Environment variables template
- **[CLOUDINARY_GUIDE.md](CLOUDINARY_GUIDE.md)** - Image upload setup
- **[PROJECT_SETUP.js](PROJECT_SETUP.js)** - Project overview script (run: `node PROJECT_SETUP.js`)

### 🚢 **Deployment**
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Deploy to Render step-by-step
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md#security-on-render)** - Security best practices

### 🛠️ **Development**
- **[validate.sh](validate.sh)** - Validate project structure
- **[scripts/seed.js](scripts/seed.js)** - Sample data seeding

---

## 🎯 Quick Navigation by Role

### For Developers
→ Start with: **QUICK_REFERENCE.md**
- API endpoints reference
- Setup instructions
- Database schema
- Common issues & solutions

### For DevOps/System Admins
→ Start with: **RENDER_DEPLOYMENT.md**
- Deployment checklist
- Environment configuration
- Security setup
- Monitoring & scaling

### For Backend Engineers
→ Start with: **README.md**
- Architecture overview
- Project structure
- Development workflow
- Testing & debugging

---

## 📋 Installation Checklist

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your Cloudinary credentials

# 3. (Optional) Seed sample data
npm run seed

# 4. Start development server
npm start

# 5. Access admin UI
# http://localhost:3000/admin/login.html
```

Default Credentials: `admin` / `admin123`

⚠️ **Change after first login!**

---

## 🏗️ Architecture Overview

```
Client App (Mobile/Web)
    ↓
    → Public APIs (/api/*)
    ↓
Node.js Express Server (Port 3000)
    ├→ Authentication (JWT)
    ├→ User Management
    ├→ Content Management
    └→ Image Upload (Cloudinary)
    ↓
SQLite Database (/database/flashcard.sqlite)
```

---

## 📊 Key Statistics

| Metric | Value |
|--------|-------|
| **Backend Language** | Node.js/JavaScript |
| **Framework** | Express.js |
| **Database** | SQLite |
| **Authentication** | JWT |
| **Models** | 8 |
| **Controllers** | 9 |
| **API Endpoints** | 33 |
| **Admin UI Pages** | 7 |
| **Middleware** | 3 |
| **Database Tables** | 9 |

---

## 🔐 Security Features

✅ JWT Token Authentication
✅ Role-Based Access Control (Admin/Moderator)
✅ Password Hashing (bcrypt)
✅ Database File Protection
✅ Rate Limiting
✅ Token Format Validation
✅ Environment-Based Secrets
✅ SQL Injection Prevention
✅ CORS Configuration
✅ Security Headers

---

## 📱 API Summary

### Public APIs (No Authentication)
- `GET /api/flashcards` - List flashcards
- `GET /api/topics` - List topics
- `GET /api/levels` - List levels
- `POST /api/auth/login` - User login

### Protected APIs (With JWT)
- `GET /api/user` - User profile
- `GET/PUT /api/bookmarks` - Bookmarks
- `GET /api/streak` - User streak
- `GET /api/badges` - User badges

### Admin APIs (Admin/Moderator)
- **Admin Users** (Admin only)
  - CRUD operations
  - Password management
  - Role assignment
  
- **Content Management** (Admin/Moderator)
  - Flashcards: CRUD + image upload
  - Topics: CRUD
  - Levels: CRUD
  - Badges: CRUD + assignment

---

## 🎨 Admin Dashboard

The admin UI provides:
- 📊 Dashboard with statistics
- 👥 User management (admin only)
- 🔐 Admin user management (admin only)
- 📚 Flashcard CRUD with image upload
- 🏷️ Topic management
- 📈 Level management
- 🏆 Badge management

**Access**: `http://localhost:3000/admin/login.html`

---

## 📂 Project Structure

```
flashcard/
├── src/                           # Source code
│   ├── app.js                    # Express app entry
│   ├── config/                   # Configuration
│   │   ├── config.js             # App config
│   │   └── database.js           # SQLite setup
│   ├── models/                   # Database models (8 files)
│   ├── controllers/              # API handlers (9 files)
│   ├── routes/                   # API routes
│   ├── middlewares/              # Auth & security
│   └── utils/                    # Services
├── public/admin/                 # Admin UI
│   ├── login.html               # Login page
│   ├── dashboard.html           # Dashboard
│   └── js/dashboard.js          # Frontend logic
├── database/                     # Database storage
│   └── flashcard.sqlite         # SQLite file
├── scripts/                      # Utility scripts
│   └── seed.js                  # Data seeding
├── Documentation/                # Guides
│   ├── README.md
│   ├── CLOUDINARY_GUIDE.md
│   ├── RENDER_DEPLOYMENT.md
│   ├── QUICK_REFERENCE.md
│   └── IMPLEMENTATION_SUMMARY.md
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore
├── package.json                  # Dependencies
└── validate.sh                   # Validation script
```

---

## 🚀 Deployment Options

### Option 1: Local Development
```bash
npm install
npm start
```
Access: `http://localhost:3000`

### Option 2: Render (Recommended)
1. Push to GitHub
2. Connect to Render
3. Set environment variables
4. Auto-deploy on push

See: **RENDER_DEPLOYMENT.md**

### Option 3: Docker (Future)
Docker setup can be added for containerization

---

## 🆘 Common Tasks

### Change Admin Password
1. Login with current credentials
2. Navigate to "Admin Users" (admin only)
3. Edit admin user
4. Change password

### Upload Flashcard Image
1. In "Flashcards" section
2. Create/Edit flashcard
3. Upload image file
4. Image sent to Cloudinary
5. URL saved to database

### Create New Topic/Level
1. Navigate to "Topics" or "Levels"
2. Click "Thêm" (Add)
3. Enter ID and label
4. Save

### Add Badge to User
1. Navigate to "Badges"
2. Click on badge
3. Click "Assign to User"
4. Select user
5. Confirm

---

## 🔧 Troubleshooting

### Port 3000 already in use?
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm start
```

### Database issues?
```bash
# Remove and recreate database
rm database/flashcard.sqlite
npm start
npm run seed
```

### Cloudinary errors?
1. Check .env file
2. Verify credentials
3. Check file size/format
4. See: CLOUDINARY_GUIDE.md

### Admin UI won't load?
1. Verify server running (port 3000)
2. Clear browser cache
3. Check console errors
4. Verify .env setup

---

## 📞 Resources

### Official Documentation
- **Node.js**: https://nodejs.org/docs
- **Express.js**: https://expressjs.com
- **SQLite**: https://www.sqlite.org/docs.html
- **Cloudinary**: https://cloudinary.com/documentation
- **Render**: https://render.com/docs
- **JWT**: https://jwt.io

### Project Docs
- README.md - Complete guide
- QUICK_REFERENCE.md - API reference
- CLOUDINARY_GUIDE.md - Image setup
- RENDER_DEPLOYMENT.md - Deployment

---

## ✨ Features at a Glance

### Authentication & Security
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ Database file protection

### Content Management
- ✅ Flashcard CRUD
- ✅ Topic management
- ✅ Level management
- ✅ Badge system
- ✅ Image upload (Cloudinary)

### User Management (Admin)
- ✅ User listing & filtering
- ✅ User edit/delete
- ✅ Admin user management
- ✅ Role assignment

### Admin Dashboard
- ✅ Statistics overview
- ✅ User management interface
- ✅ Content CRUD interface
- ✅ Image upload UI
- ✅ Role-based menu

---

## 🎓 Learning Path

**Total Setup Time**: ~30 minutes
**First Deploy**: ~10 minutes

1. **Read** (5 min): IMPLEMENTATION_SUMMARY.md
2. **Setup** (10 min): Follow QUICK_REFERENCE.md
3. **Test** (10 min): Run server, test endpoints
4. **Deploy** (5 min): Follow RENDER_DEPLOYMENT.md

---

## 📝 Quick Commands

```bash
# Install
npm install

# Development (with auto-reload)
npm run dev

# Start production
npm start

# Seed sample data
npm run seed

# Validate structure
bash validate.sh

# Show this info
node PROJECT_SETUP.js
```

---

## 🏁 Status: READY TO USE

✅ All features implemented
✅ Security best practices applied
✅ Documentation complete
✅ Ready for deployment

**Next Step**: `npm install` → `npm start`

---

**Created with ❤️ for Flashcard Kids**

Last Updated: December 2025
