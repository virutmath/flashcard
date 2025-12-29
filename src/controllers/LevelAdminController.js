const Level = require('../models/Level');

class LevelAdminController {
  // POST /admin/levels - Tạo level mới
  static create(req, res) {
    const { id, label } = req.body;

    if (!id || !label) {
      return res.status(400).json({ error: 'ID and label are required' });
    }

    try {
      const level = Level.create(id, label);
      res.status(201).json(level);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /admin/levels - Liệt kê levels
  static getAll(req, res) {
    const levels = Level.getAll();
    res.json({ data: levels });
  }

  // GET /admin/levels/:id - Lấy level theo ID
  static getById(req, res) {
    const level = Level.getById(req.params.id);
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }
    res.json(level);
  }

  // PUT /admin/levels/:id - Cập nhật level
  static update(req, res) {
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ error: 'Label is required' });
    }

    const level = Level.update(req.params.id, label);
    res.json(level);
  }

  // DELETE /admin/levels/:id - Xóa level
  static delete(req, res) {
    Level.delete(req.params.id);
    res.json({ success: true });
  }
}

module.exports = LevelAdminController;
