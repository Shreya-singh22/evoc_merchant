'use strict';

const OrbitApiError = require('../utils/OrbitApiError');

/**
 * rbac — Role-Based Access Control middleware factory.
 *
 * Usage:  rbac([ROLES.MERCHANT, ROLES.ADMIN])
 * Must be used AFTER the auth middleware (which sets req.user).
 *
 * @param {string[]} allowedRoles
 * @returns {Function} Express middleware
 */
function rbac(allowedRoles = []) {
  return function rbacMiddleware(req, res, next) {
    if (!req.user) {
      return next(new OrbitApiError('UNAUTHORIZED', 'Authentication required.', req.requestId, 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new OrbitApiError('FORBIDDEN', 'You do not have permission to perform this action.', req.requestId, 403));
    }
    next();
  };
}

module.exports = rbac;
