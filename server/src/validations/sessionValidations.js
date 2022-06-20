const { body } = require('express-validator'); // validation middleware

exports.validateUsername = [
  body('username')
    .exists()
    .matches(/^([a-z]|[0-9]){4,20}$/),
];
