/**
 * Security middleware để chặn truy cập files nhạy cảm
 */

// Chặn access tới các file DB/sensitive
const blockSensitiveFiles = (req, res, next) => {
  const sensitivePatterns = [
    /\.sqlite/i,
    /\.db/i,
    /\.env/i,
    /node_modules/i,
    /\.git/i,
    /\.gitignore/i,
    /package\.json/i,
    /package-lock\.json/i
  ];

  const requestPath = req.path.toLowerCase();
  for (const pattern of sensitivePatterns) {
    if (pattern.test(requestPath)) {
      return res.status(403).json({ error: 'Access denied' });
    }
  }

  next();
};

/**
 * Rate limiting (simple implementation)
 * Trong production, nên dùng redis + express-rate-limit
 */
const requestCounts = new Map();

const simpleRateLimit = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    let requests = requestCounts.get(ip);
    requests = requests.filter(time => time > windowStart);

    if (requests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    requests.push(now);
    requestCounts.set(ip, requests);
    next();
  };
};

/**
 * Validate JWT token format
 */
const validateTokenFormat = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(400).json({ error: 'Invalid Authorization header format' });
    }

    // Basic JWT format validation (3 parts separated by dots)
    if (!parts[1].match(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)) {
      return res.status(400).json({ error: 'Invalid JWT format' });
    }
  }
  next();
};

module.exports = {
  blockSensitiveFiles,
  simpleRateLimit,
  validateTokenFormat
};
