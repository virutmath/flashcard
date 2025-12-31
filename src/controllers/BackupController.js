const fs = require('fs');
const path = require('path');
const AdminUser = require('../models/AdminUser');
const { closeDatabase, initializeDatabase } = require('../config/database');

const DB_PATH = process.env.DB_PATH || path.resolve('./data/flashcard.db');
const HSK1_PATH = process.env.HSK1_PATH || path.resolve('./data/hsk1_words.json');

class BackupController {
  static ensurePassword(adminId, password) {
    if (!password) {
      const error = new Error('Vui lòng nhập mật khẩu admin');
      error.status = 400;
      throw error;
    }

    const admin = AdminUser.getById(adminId);
    if (!admin) {
      const error = new Error('Admin không tồn tại');
      error.status = 404;
      throw error;
    }

    const valid = AdminUser.verifyPassword(password, admin.password);
    if (!valid) {
      const error = new Error('Mật khẩu không đúng');
      error.status = 401;
      throw error;
    }

    return admin;
  }

  static isSQLiteFile(filePath) {
    try {
      const header = fs.readFileSync(filePath).slice(0, 15).toString();
      return header.includes('SQLite format 3');
    } catch (_err) {
      return false;
    }
  }

  static sendError(res, error) {
    const status = error.status || 400;
    return res.status(status).json({ error: error.message || 'Đã xảy ra lỗi' });
  }

  static downloadDatabase(req, res) {
    try {
      BackupController.ensurePassword(req.admin.adminId, req.body.password);

      if (!fs.existsSync(DB_PATH)) {
        const error = new Error('Không tìm thấy file flashcard.db');
        error.status = 404;
        throw error;
      }

      return res.download(DB_PATH, 'flashcard.db');
    } catch (error) {
      return BackupController.sendError(res, error);
    }
  }

  static async uploadDatabase(req, res) {
    const uploadedPath = req.file && req.file.path;
    let backupPath = null;

    try {
      BackupController.ensurePassword(req.admin.adminId, req.body.password);

      if (!uploadedPath || !fs.existsSync(uploadedPath)) {
        const error = new Error('Chưa chọn file flashcard.db');
        error.status = 400;
        throw error;
      }

      if (!BackupController.isSQLiteFile(uploadedPath)) {
        const error = new Error('File không phải định dạng SQLite hợp lệ');
        error.status = 400;
        throw error;
      }

      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

      if (fs.existsSync(DB_PATH)) {
        backupPath = `${DB_PATH}.bak-${Date.now()}`;
        fs.copyFileSync(DB_PATH, backupPath);
      }

      await closeDatabase();
      fs.copyFileSync(uploadedPath, DB_PATH);
      await initializeDatabase();

      return res.json({ success: true, message: 'Khôi phục flashcard.db thành công' });
    } catch (error) {
      if (backupPath && fs.existsSync(backupPath)) {
        try {
          fs.copyFileSync(backupPath, DB_PATH);
          await initializeDatabase();
        } catch (_err) {
          // Swallow secondary errors to avoid masking the root cause
        }
      }
      return BackupController.sendError(res, error);
    } finally {
      if (uploadedPath && fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }
      if (backupPath && fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
    }
  }

  static downloadHsk(req, res) {
    try {
      BackupController.ensurePassword(req.admin.adminId, req.body.password);

      if (!fs.existsSync(HSK1_PATH)) {
        const error = new Error('Không tìm thấy file hsk1_words.json');
        error.status = 404;
        throw error;
      }

      return res.download(HSK1_PATH, 'hsk1_words.json');
    } catch (error) {
      return BackupController.sendError(res, error);
    }
  }

  static async uploadHsk(req, res) {
    const uploadedPath = req.file && req.file.path;

    try {
      BackupController.ensurePassword(req.admin.adminId, req.body.password);

      if (!uploadedPath || !fs.existsSync(uploadedPath)) {
        const error = new Error('Chưa chọn file hsk1_words.json');
        error.status = 400;
        throw error;
      }

      const raw = fs.readFileSync(uploadedPath, 'utf8');
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (_err) {
        const error = new Error('File JSON không hợp lệ');
        error.status = 400;
        throw error;
      }

      if (!Array.isArray(parsed)) {
        const error = new Error('Dữ liệu HSK1 phải là mảng JSON');
        error.status = 400;
        throw error;
      }

      fs.mkdirSync(path.dirname(HSK1_PATH), { recursive: true });
      fs.writeFileSync(HSK1_PATH, JSON.stringify(parsed, null, 2), 'utf8');

      return res.json({ success: true, message: 'Cập nhật hsk1_words.json thành công', count: parsed.length });
    } catch (error) {
      return BackupController.sendError(res, error);
    } finally {
      if (uploadedPath && fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }
    }
  }
}

module.exports = BackupController;
