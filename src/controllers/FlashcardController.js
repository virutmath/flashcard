const Flashcard = require('../models/Flashcard');
const Topic = require('../models/Topic');
const Level = require('../models/Level');

class FlashcardController {
  // GET /flashcards - Liệt kê flashcards (có phân trang, lọc)
  static listFlashcards(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 20, 100);
    const topic = req.query.topic || null;
    const level = req.query.level || null;

    const result = Flashcard.getAll(page, pageSize, topic, level);

    // Get available topics và levels
    const topics = Topic.getAll();
    const levels = Level.getAll();

    res.json({
      data: result.flashcards,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
        topics: topics.map(t => t.id),
        levels: levels.map(l => l.id)
      }
    });
  }

  // GET /topics - Liệt kê topics
  static listTopics(req, res) {
    const topics = Topic.getAll();
    res.json({ data: topics });
  }

  // GET /levels - Liệt kê levels
  static listLevels(req, res) {
    const levels = Level.getAll();
    res.json({ data: levels });
  }
}

module.exports = FlashcardController;
