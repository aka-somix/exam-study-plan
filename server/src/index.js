/*
 * IMPORTS
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// locals
const configs = require('./configs');
const requestIdentifierMiddleware = require('./middleware/req-identifier');
const { loggingMiddleware } = require('./middleware/logging');

// routes
const coursesRouter = require('./routes/courses');
const sessionRouter = require('./routes/session');

/*
 * Build Express Server and add Middlewares
 */
const app = express();
const port = configs.PORT;

// Helmet for generic security
app.use(helmet());

// handle json payloads
app.use(express.json());

// Add request identifier for logging purpose
app.use(requestIdentifierMiddleware);

// Add logging middleware
app.use(loggingMiddleware);

// CORS
const corsOptions = {
  origin: `http://localhost:${configs.PORT}`,
};
app.use(cors(corsOptions)); // For DEV purpose only.

/*
 * Define Routes
 */

app.get('/health', (req, res) => {
  res.json({ health: 'ok' });
});

// courses
app.use('/api/courses/', coursesRouter);

// session (login/logout)
app.use('/api/session/', sessionRouter);

/*
 * Deploy Server
 */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${configs.PORT}`);
});
