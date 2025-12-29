const Badge = require('../models/Badge');

class BadgeAdminController {
  // POST /admin/badges - Tạo badge mới
  static create(req, res) {
    const { id, name, icon, description } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: 'ID and name are required' });
    }

    try {
      const badge = Badge.create(id, name, icon, description);
      res.status(201).json(badge);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /admin/badges - Liệt kê badges
  static getAll(req, res) {
    const badges = Badge.getAll();
    res.json({ data: badges });
  }

  // GET /admin/badges/:id - Lấy badge theo ID
  static getById(req, res) {
    const badge = Badge.getById(req.params.id);
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }
    res.json(badge);
  }

  // PUT /admin/badges/:id - Cập nhật badge
  static update(req, res) {
    const { name, icon, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const badge = Badge.update(req.params.id, name, icon, description);
    res.json(badge);
  }

  // DELETE /admin/badges/:id - Xóa badge
  static delete(req, res) {
    Badge.delete(req.params.id);
    res.json({ success: true });
  }

  // POST /admin/badges/:id/assign - Gán badge cho user
  static assignToUser(req, res) {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    Badge.addBadgeToUser(userId, req.params.id);
    res.json({ success: true });
  }

  // DELETE /admin/badges/:id/unassign - Gỡ badge khỏi user
  static unassignFromUser(req, res) {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    Badge.removeBadgeFromUser(userId, req.params.id);
    res.json({ success: true });
  }
}

module.exports = BadgeAdminController;
