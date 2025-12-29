const { getDatabase } = require('../config/database');
const bcrypt = require('bcrypt');

class AdminUser {
  static getDb() {
    return getDatabase();
  }

  static create(username, password, role = 'moderator') {
    const db = this.getDb();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO admin_users (username, password, role)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(username, hashedPassword, role);
    return this.getById(result.lastInsertRowid);
  }

  static getById(id) {
    const db = this.getDb();
    return db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id);
  }

  static getByUsername(username) {
    const db = this.getDb();
    return db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  }

  static verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  static getAll() {
    const db = this.getDb();
    return db.prepare('SELECT id, username, role, created_at FROM admin_users').all();
  }

  static update(id, username, role) {
    const db = this.getDb();
    const stmt = db.prepare(`
      UPDATE admin_users
      SET username = ?, role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(username, role, id);
    return this.getById(id);
  }

  static delete(id) {
    const db = this.getDb();
    db.prepare('DELETE FROM admin_users WHERE id = ?').run(id);
  }

  static changePassword(id, newPassword) {
    const db = this.getDb();
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare(`
      UPDATE admin_users
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(hashedPassword, id);
  }
}

module.exports = AdminUser;
