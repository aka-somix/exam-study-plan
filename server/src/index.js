'use-strict';

/*
 * IMPORTS
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// locals
const configs = require('./configs');
const requestIdentifierMiddleware = require('./middleware/req-identifier');
const { loggingMiddlewares } = require('./middleware/logging');
const userService = require('./services/userService');

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

/** * Set up Passport ** */
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  (username, password, done) => {
    userService.getUser(username, password).then((user) => {
      if (!user) return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    });
  },
));

/*
 * Serialize and de-serialize the user (user object <-> session)
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userService.getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    }).catch((err) => {
      done(err, null);
    });
});

// Session Setup to use it has storage for Passport
app.use(session({
  secret: 'f6efe2eb-3eda-4bdc-aa8c-2ba9d2d6bbe5',
  resave: false,
  saveUninitialized: false,
}));

// Passport Authentication Middleware
app.use(passport.initialize());
app.use(passport.session());

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
