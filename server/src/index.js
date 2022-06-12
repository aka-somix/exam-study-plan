'use-strict';

/*
 * IMPORTS
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// locals
const configs = require('./configs');
const requestIdentifierMiddleware = require('./middleware/req-identifier');
const { loggingMiddlewares } = require('./middleware/logging');

// routes
const coursesRouter = require('./routes/courses');
const studyPlanRouter = require('./routes/studyPlan');
const sessionRouter = require('./routes/session');

/*
 * Build Express Server and add Middlewares
 */
const app = express();
const port = configs.PORT;

// Helmet for security
app.use(helmet());

// handle json payloads
app.use(express.json());

// Add request identifier for logging purpose
app.use(requestIdentifierMiddleware);

// Add logging middleware
app.use(...loggingMiddlewares);

// CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
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

// study plan
app.use('/api/study-plan/', studyPlanRouter);

// session (login/logout)
app.use('/api/session/', sessionRouter);

/*
 * Deploy Server
 */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${configs.PORT}`);
});
