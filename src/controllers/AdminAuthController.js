const AdminUser = require('../models/AdminUser');
const AuthService = require('../utils/AuthService');

class AdminAuthController {
  // POST /admin/auth/login - Đăng nhập admin
  static login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = AdminUser.getByUsername(username);
    if (!admin || !AdminUser.verifyPassword(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = AuthService.generateToken({
      adminId: admin.id,
      role: admin.role
    });

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
  }

  // POST /admin/auth/logout - Đăng xuất admin
  static logout(req, res) {
    res.json({ success: true });
  }
}

module.exports = AdminAuthController;
