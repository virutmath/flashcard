const { getDatabase } = require('../config/database');

class Level {
  static getDb() {
    return getDatabase();
  }
  static create(id, label) {
    const db = this.getDb();
    const stmt = db.prepare(`
      INSERT INTO levels (id, label)
      VALUES (?, ?)
    `);
    stmt.run(id, label);
    return this.getById(id);
  }

  static getById(id) {
    const db = this.getDb();
    return db.prepare('SELECT * FROM levels WHERE id = ?').get(id);
  }

  static getAll() {
    const db = this.getDb();
    return db.prepare(`
      SELECT l.id, l.label, COUNT(f.id) as count
      FROM levels l
      LEFT JOIN flashcards f ON l.id = f.level_id
      GROUP BY l.id
      ORDER BY l.label
    `).all();
  }

  static update(id, label) {
    const db = this.getDb();
    db.prepare(`
      UPDATE levels
      SET label = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(label, id);
    return this.getById(id);
  }

  static delete(id) {
    const db = this.getDb();
    db.prepare('DELETE FROM levels WHERE id = ?').run(id);
  }
}

module.exports = Level;

