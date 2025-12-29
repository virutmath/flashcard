const { getDatabase } = require('../config/database');

class User {
  static getDb() {
    return getDatabase();
  }
  static create(id, name, email, password, avatar = null) {
    const db = this.getDb();
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, avatar)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, email, password, avatar);
    return this.getById(id);
  }

  static getById(id) {
    const db = this.getDb();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  static getByEmail(email) {
    const db = this.getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  static getAll(page = 1, pageSize = 20) {
    const db = this.getDb();
    const offset = (page - 1) * pageSize;
    const users = db.prepare(`
      SELECT * FROM users
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(pageSize, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalPages = Math.ceil(total / pageSize);

    return { users, total, totalPages, page, pageSize };
  }

  static update(id, name, email, avatar) {
    const db = this.getDb();
    const stmt = db.prepare(`
      UPDATE users
      SET name = ?, email = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(name, email, avatar, id);
    return this.getById(id);
  }

  static delete(id) {
    const db = this.getDb();
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  static getUserWithProfile(id) {
    const db = this.getDb();
    const user = this.getById(id);
    if (!user) {
      return null;
    }

    const badges = db.prepare(`
      SELECT b.* FROM badges b
      JOIN user_badges ub ON b.id = ub.badge_id
      WHERE ub.user_id = ?
    `).all(id);

    const bookmarks = db.prepare(`
      SELECT flashcard_id FROM bookmarks WHERE user_id = ?
    `).all(id).map(row => row.flashcard_id);

    const streak = db.prepare('SELECT * FROM streaks WHERE user_id = ?').get(id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      badges,
      bookmarks,
      streak: streak || { current: 0, best: 0, last_updated: null }
    };
  }
}

module.exports = User;

