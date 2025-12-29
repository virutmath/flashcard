const Topic = require('../models/Topic');

class TopicAdminController {
  // POST /admin/topics - Tạo topic mới
  static create(req, res) {
    const { id, label } = req.body;

    if (!id || !label) {
      return res.status(400).json({ error: 'ID and label are required' });
    }

    try {
      const topic = Topic.create(id, label);
      res.status(201).json(topic);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /admin/topics - Liệt kê topics
  static getAll(req, res) {
    const topics = Topic.getAll();
    res.json({ data: topics });
  }

  // GET /admin/topics/:id - Lấy topic theo ID
  static getById(req, res) {
    const topic = Topic.getById(req.params.id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  }

  // PUT /admin/topics/:id - Cập nhật topic
  static update(req, res) {
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ error: 'Label is required' });
    }

    const topic = Topic.update(req.params.id, label);
    res.json(topic);
  }

  // DELETE /admin/topics/:id - Xóa topic
  static delete(req, res) {
    Topic.delete(req.params.id);
    res.json({ success: true });
  }
}

module.exports = TopicAdminController;
