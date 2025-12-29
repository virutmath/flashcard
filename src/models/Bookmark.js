const { getDatabase } = require('../config/database');

class Bookmark {
  static getDb() {
    return getDatabase();
  }
  static addBookmark(userId, flashcardId) {
    const db = this.getDb();
    db.prepare(`
      INSERT OR IGNORE INTO bookmarks (user_id, flashcard_id)
      VALUES (?, ?)
    `).run(userId, flashcardId);
  }

  static removeBookmark(userId, flashcardId) {
    const db = this.getDb();
    db.prepare(`
      DELETE FROM bookmarks WHERE user_id = ? AND flashcard_id = ?
    `).run(userId, flashcardId);
  }

  static getUserBookmarks(userId) {
    const db = this.getDb();
    return db.prepare(`
      SELECT flashcard_id FROM bookmarks WHERE user_id = ?
    `).all(userId).map(row => row.flashcard_id);
  }

  static updateUserBookmarks(userId, flashcardIds) {
    const db = this.getDb();
    db.prepare('DELETE FROM bookmarks WHERE user_id = ?').run(userId);

    if (flashcardIds && flashcardIds.length > 0) {
      const stmt = db.prepare(`
        INSERT INTO bookmarks (user_id, flashcard_id)
        VALUES (?, ?)
      `);

      for (const flashcardId of flashcardIds) {
        stmt.run(userId, flashcardId);
      }
    }
  }
}

module.exports = Bookmark;

