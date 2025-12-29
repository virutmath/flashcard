# 🚀 START HERE

Welcome to your Flashcard Admin Backend project!

This guide will get you up and running in **5 minutes**.

---

## ⚡ 5-Minute Quick Start

### Step 1: Install (1 minute)
```bash
npm install
```

### Step 2: Setup (2 minutes)
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add Cloudinary credentials:
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET
# Also set:
# - JWT_SECRET (any random string)
# - DEFAULT_ADMIN_PASSWORD (your secure password)
```

**Getting Cloudinary credentials?**
1. Go to https://cloudinary.com/users/register/free
2. Sign up (free account)
3. Go to Dashboard
4. Copy credentials from "Product Environment Credentials"

### Step 3: Start (1 minute)
```bash
npm start
```

You should see:
```
✓ Flashcard Admin Server running on port 3000
✓ Admin UI: http://localhost:3000/admin/login.html
```

### Step 4: Login (1 minute)
- Open: http://localhost:3000/admin/login.html
- Username: `admin`
- Password: `admin123` (or what you set in .env)

### Step 5: Enjoy! ✨
You're now in the admin dashboard. Explore the features!

---

## 📚 Read Next

After setup, read these in order:

1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - API reference & commands
2. **[README.md](README.md)** - Full documentation
3. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built

---

## 🔑 Important Notes

⚠️ **Change admin password after first login!**

To change password:
1. In Admin UI → "Admin Users" section
2. Edit admin user
3. Update password
4. Save

---

## 🆘 Stuck?

### Port 3000 already in use?
```bash
PORT=3001 npm start
```

### Cloudinary not working?
- Check .env file has credentials
- Verify Cloudinary account active
- See: CLOUDINARY_GUIDE.md

### Admin UI won't load?
- Check if server is running
- Try http://localhost:3000/health
- Check browser console for errors

### Still stuck?
See **QUICK_REFERENCE.md** → Troubleshooting section

---

## 🌟 What You Have

✅ **Complete Backend**: 33 API endpoints
✅ **Admin Dashboard**: Professional UI for content management
✅ **Database**: SQLite (auto-created)
✅ **Security**: JWT, role-based access, encryption
✅ **Documentation**: 6 comprehensive guides
✅ **Ready to Deploy**: Push to Render anytime

---

## 📊 Quick Stats

- **Backend**: Node.js + Express
- **Database**: SQLite
- **Auth**: JWT + bcrypt
- **Images**: Cloudinary
- **UI**: Bootstrap 5
- **Endpoints**: 33
- **Models**: 8

---

## 🚢 Deploy to Render Later

When ready to deploy:

1. Push code to GitHub
2. Open https://render.com
3. Create new Web Service
4. Connect your GitHub repo
5. Add environment variables
6. Deploy! 🎉

See **RENDER_DEPLOYMENT.md** for detailed steps.

---

## 🎯 Next Actions

- [ ] Complete Quick Start above
- [ ] Read QUICK_REFERENCE.md
- [ ] Explore Admin Dashboard
- [ ] Test API endpoints
- [ ] Create some sample data
- [ ] When ready: Deploy to Render

---

## 💡 Pro Tips

1. **Seed Sample Data**: `npm run seed`
   - Adds sample flashcards, topics, levels, badges

2. **Watch Mode**: `npm run dev`
   - Auto-restarts server on code changes

3. **View Project Info**: `node PROJECT_SETUP.js`
   - Shows project statistics

4. **Validate Structure**: `bash validate.sh`
   - Checks all files are present

---

## 🔗 Useful Links

| Resource | Link |
|----------|------|
| Node.js | https://nodejs.org |
| Express | https://expressjs.com |
| Cloudinary | https://cloudinary.com |
| Render | https://render.com |
| Project Docs | See INDEX.md |

---

## ⏱️ Timeline

| Step | Time | Action |
|------|------|--------|
| 1 | 1 min | `npm install` |
| 2 | 2 min | Setup .env |
| 3 | 1 min | `npm start` |
| 4 | 1 min | Login to admin UI |
| **Total** | **5 min** | **Ready to use!** |

---

## 🎓 Learning Path

After getting started:

1. **Week 1**: Explore features, create content
2. **Week 2**: Read documentation, understand code
3. **Week 3**: Deploy to Render
4. **Week 4+**: Extend functionality

---

## ✨ You're All Set!

Everything is ready to go. Just follow the 5 steps above.

**Questions?** Check the documentation files:
- **INDEX.md** - Navigation guide
- **README.md** - Full documentation
- **QUICK_REFERENCE.md** - API reference

**Good luck! 🚀**

---

**Quick Commands**
```bash
npm install       # Install dependencies
npm start         # Start server
npm run dev       # Watch mode
npm run seed      # Add sample data
bash validate.sh  # Check structure
```

**Access**
```
Admin UI:  http://localhost:3000/admin/login.html
API:       http://localhost:3000/api
Health:    http://localhost:3000/health
```

---

**Happy Building! 🎉**
