const AdminUser = require('../models/AdminUser');

class AdminUserController {
  // GET /admin/admin-users - Liệt kê admin users (chỉ admin)
  static getAll(req, res) {
    const admins = AdminUser.getAll();
    res.json({ data: admins });
  }

  // GET /admin/admin-users/:id - Lấy thông tin admin user
  static getById(req, res) {
    const admin = AdminUser.getById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin user not found' });
    }
    res.json(admin);
  }

  // POST /admin/admin-users - Tạo admin user mới (chỉ admin)
  static create(req, res) {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    if (!['admin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "admin" or "moderator"' });
    }

    try {
      const admin = AdminUser.create(username, password, role);
      res.status(201).json({
        id: admin.id,
        username: admin.username,
        role: admin.role
      });
    } catch (error) {
      res.status(400).json({ error: 'Username already exists' });
    }
  }

  // PUT /admin/admin-users/:id - Cập nhật admin user (chỉ admin)
  static update(req, res) {
    const { username, role } = req.body;

    if (!username || !role) {
      return res.status(400).json({ error: 'Username and role are required' });
    }

    if (!['admin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "admin" or "moderator"' });
    }

    const admin = AdminUser.update(req.params.id, username, role);
    res.json({
      id: admin.id,
      username: admin.username,
      role: admin.role
    });
  }

  // DELETE /admin/admin-users/:id - Xóa admin user (chỉ admin)
  static delete(req, res) {
    AdminUser.delete(req.params.id);
    res.json({ success: true });
  }

  // PUT /admin/admin-users/:id/password - Đổi mật khẩu
  static changePassword(req, res) {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    AdminUser.changePassword(req.params.id, newPassword);
    res.json({ success: true });
  }
}

module.exports = AdminUserController;
