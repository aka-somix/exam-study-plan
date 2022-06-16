const { body } = require('express-validator'); // validation middleware

exports.validatePostStudyPlan = [
  body('studentType').exists().isIn(['part-time', 'full-time']),

];

exports.validatePutStudyPlan = [
  body('courses').exists(),
];
