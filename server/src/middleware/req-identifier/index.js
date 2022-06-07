/**
 * Insert Here the middleware to assign to each request an ID
 */
const uuid = require('uuid').v4;

const requestIdentifierMiddleware = (req, res, next) => {
  req.id = uuid();
  next();
};

module.exports = requestIdentifierMiddleware;
