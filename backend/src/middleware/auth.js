'use strict';

const jwt = require('jsonwebtoken');
const OrbitApiError = require('../utils/OrbitApiError');

/**
 * auth middleware
 * Validates the Bearer JWT in the Authorization header.
 * Attaches the decoded payload as req.user.
 */
function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new OrbitApiError('UNAUTHORIZED', 'Authentication token missing.', req.requestId, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.user = decoded;
    next();
  } catch (err) {
    next(new OrbitApiError('INVALID_TOKEN', 'Authentication token is invalid or expired.', req.requestId, 401));
  }
}

module.exports = auth;
