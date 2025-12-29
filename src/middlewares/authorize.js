// Middleware kiểm tra quyền admin (toàn quyền)
const requireAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }

  if (req.admin.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

// Middleware kiểm tra quyền admin hoặc moderator (nhập liệu)
const requireAdminOrModerator = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }

  if (req.admin.role !== 'admin' && req.admin.role !== 'moderator') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  next();
};

module.exports = {
  requireAdmin,
  requireAdminOrModerator
};
