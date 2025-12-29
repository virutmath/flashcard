const { getDatabase } = require('../config/database');

class Topic {
  static getDb() {
    return getDatabase();
  }
  static create(id, label) {
    const db = this.getDb();
    const stmt = db.prepare(`
      INSERT INTO topics (id, label)
      VALUES (?, ?)
    `);
    stmt.run(id, label);
    return this.getById(id);
  }

  static getById(id) {
    const db = this.getDb();
    return db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
  }

  static getAll() {
    const db = this.getDb();
    return db.prepare(`
      SELECT t.id, t.label, COUNT(f.id) as count
      FROM topics t
      LEFT JOIN flashcards f ON t.id = f.topic_id
      GROUP BY t.id
      ORDER BY t.label
    `).all();
  }

  static update(id, label) {
    const db = this.getDb();
    db.prepare(`
      UPDATE topics
      SET label = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(label, id);
    return this.getById(id);
  }

  static delete(id) {
    const db = this.getDb();
    db.prepare('DELETE FROM topics WHERE id = ?').run(id);
  }
}

module.exports = Topic;

