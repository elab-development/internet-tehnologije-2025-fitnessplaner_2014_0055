const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { JwtBlacklist } = require('../models');

module.exports = async function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed token' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwt.secret);

    const revoked = await JwtBlacklist.findOne({ where: { token } });
    if (revoked) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    req.userId = payload.id;
    req.userRole = payload.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
