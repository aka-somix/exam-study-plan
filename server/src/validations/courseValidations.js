const { param } = require('express-validator');

exports.validateGetCourseDetails = [
  param('code').exists().isLength({ min: 7, max: 7 }),
];
