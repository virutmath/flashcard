const jwt = require('jsonwebtoken');
const config = require('../config/config');

class AuthService {
  static generateToken(payload, expiresIn = config.jwt.expiry) {
    return jwt.sign(payload, config.jwt.secret, { expiresIn });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

module.exports = AuthService;
