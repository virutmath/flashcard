const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const Streak = require('../models/Streak');
const AuthService = require('../utils/AuthService');

class PublicController {
  // POST /auth/login - Đăng nhập
  static login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Note: Thực tế sẽ verify password, ở đây giả định email tồn tại
    const user = User.getByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = AuthService.generateToken({ userId: user.id });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  }

  // POST /auth/logout - Đăng xuất
  static logout(req, res) {
    res.json({ success: true });
  }

  // GET /user - Lấy profile user hiện tại
  static getCurrentUser(req, res) {
    const user = User.getUserWithProfile(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  }

  // GET /bookmarks - Lấy bookmarks của user
  static getBookmarks(req, res) {
    const bookmarks = Bookmark.getUserBookmarks(req.user.userId);
    res.json({ data: { bookmarks } });
  }

  // PUT /bookmarks - Cập nhật bookmarks
  static updateBookmarks(req, res) {
    const { bookmarks } = req.body;

    if (!Array.isArray(bookmarks)) {
      return res.status(400).json({ error: 'Bookmarks must be an array' });
    }

    Bookmark.updateUserBookmarks(req.user.userId, bookmarks);
    res.json({ data: { bookmarks } });
  }

  // GET /streak - Lấy streak info
  static getStreak(req, res) {
    const streak = Streak.getByUserId(req.user.userId);

    if (!streak) {
      Streak.initializeStreak(req.user.userId);
      return res.json({
        current: 0,
        best: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }

    res.json({
      current: streak.current,
      best: streak.best,
      lastUpdated: streak.last_updated
    });
  }

  // GET /badges - Lấy badges của user
  static getBadges(req, res) {
    const Badge = require('../models/Badge');
    const badges = Badge.getUserBadges(req.user.userId);
    res.json({ data: badges });
  }
}

module.exports = PublicController;
