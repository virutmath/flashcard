const AuthService = require('../utils/AuthService');

// Middleware xác thực JWT cho các route public (user app)
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = AuthService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

// Middleware xác thực JWT cho admin
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = AuthService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  if (!decoded.adminId) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.admin = decoded;
  next();
};

module.exports = {
  authenticateUser,
  authenticateAdmin
};
