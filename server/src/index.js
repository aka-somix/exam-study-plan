/*
 * IMPORTS
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// locals
const configs = require('./configs');
const requestIdentifierMiddleware = require('./middleware/req-identifier');

/*
 * Build Express Server and add Middlewares
 */
const app = express();
const port = configs.PORT;

// Helmet for generic security
app.use(helmet());

// handle json payloads
app.use(express.json());

// TODO Add logging middleware

// Add request identifier for logging purpose
app.use(requestIdentifierMiddleware);

// CORS
const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions)); // For DEV purpose only.

/*
 * Define Routes
 */
app.get('/', (req, res) => {
  console.log(`req identifier ${req.id}`);
  res.statusCode = 200;
  res.send({ test: 'ok' });
});

/*
 * Deploy Server
 */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${configs.PORT}`);
});
