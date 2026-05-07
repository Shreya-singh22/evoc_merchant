'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * requestId middleware
 * Generates a unique req.requestId for every incoming request
 * and echoes it back as the X-Request-Id response header.
 * Must be mounted GLOBALLY before all routes in server.js.
 */
function requestIdMiddleware(req, res, next) {
  const requestId = 'req_' + uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

module.exports = requestIdMiddleware;
