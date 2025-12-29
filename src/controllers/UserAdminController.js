const User = require('../models/User');
const Streak = require('../models/Streak');

class UserAdminController {
  // GET /admin/users - Liệt kê users (phân trang)
  static getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 20, 100);

    const result = User.getAll(page, pageSize);
    res.json({
      data: result.users,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  }

  // GET /admin/users/:id - Lấy thông tin user
  static getById(req, res) {
    const user = User.getUserWithProfile(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  }

  // DELETE /admin/users/:id - Xóa user
  static delete(req, res) {
    User.delete(req.params.id);
    Streak.deleteByUserId(req.params.id);
    res.json({ success: true });
  }

  // PUT /admin/users/:id - Cập nhật thông tin user
  static update(req, res) {
    const { name, email, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const user = User.update(req.params.id, name, email, avatar);
    res.json(user);
  }
}

module.exports = UserAdminController;
