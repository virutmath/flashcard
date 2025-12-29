const { getDatabase } = require('../config/database');

class Badge {
  static getDb() {
    return getDatabase();
  }
  static create(id, name, icon = null, description = null) {
    const db = this.getDb();
    const stmt = db.prepare(`
      INSERT INTO badges (id, name, icon, description)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, name, icon, description);
    return this.getById(id);
  }

  static getById(id) {
    const db = this.getDb();
    return db.prepare('SELECT * FROM badges WHERE id = ?').get(id);
  }

  static getAll() {
    const db = this.getDb();
    return db.prepare('SELECT * FROM badges ORDER BY created_at DESC').all();
  }

  static update(id, name, icon, description) {
    const db = this.getDb();
    db.prepare(`
      UPDATE badges
      SET name = ?, icon = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, icon, description, id);
    return this.getById(id);
  }

  static delete(id) {
    const db = this.getDb();
    db.prepare('DELETE FROM badges WHERE id = ?').run(id);
  }

  static getUserBadges(userId) {
    const db = this.getDb();
    return db.prepare(`
      SELECT b.* FROM badges b
      JOIN user_badges ub ON b.id = ub.badge_id
      WHERE ub.user_id = ?
      ORDER BY ub.earned_at DESC
    `).all(userId);
  }

  static addBadgeToUser(userId, badgeId) {
    const db = this.getDb();
    db.prepare(`
      INSERT OR IGNORE INTO user_badges (user_id, badge_id)
      VALUES (?, ?)
    `).run(userId, badgeId);
  }

  static removeBadgeFromUser(userId, badgeId) {
    const db = this.getDb();
    db.prepare(`
      DELETE FROM user_badges WHERE user_id = ? AND badge_id = ?
    `).run(userId, badgeId);
  }
}

module.exports = Badge;

