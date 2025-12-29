const { getDatabase } = require('../config/database');

class Streak {
  static getDb() {
    return getDatabase();
  }
  static getByUserId(userId) {
    const db = this.getDb();
    return db.prepare('SELECT * FROM streaks WHERE user_id = ?').get(userId);
  }

  static initializeStreak(userId) {
    const db = this.getDb();
    db.prepare(`
      INSERT OR IGNORE INTO streaks (user_id, current, best, last_updated)
      VALUES (?, 0, 0, CURRENT_DATE)
    `).run(userId);
  }

  static updateStreak(userId, current, best) {
    const db = this.getDb();
    const stmt = db.prepare(`
      UPDATE streaks
      SET current = ?, best = ?, last_updated = CURRENT_DATE
      WHERE user_id = ?
    `);
    stmt.run(current, best, userId);
  }

  static deleteByUserId(userId) {
    const db = this.getDb();
    db.prepare('DELETE FROM streaks WHERE user_id = ?').run(userId);
  }
}

module.exports = Streak;

