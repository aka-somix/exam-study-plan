'use-strict';

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const userService = require('../services/userService');

const router = express.Router();

/*
 * SETUP
 */

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  (username, password, done) => {
    userService.getUserCredentials(username, password).then((user) => {
      if (!user) return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    });
  },
));

/*
 * Serialize and de-serialize the user (user object <-> session)
 */
passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  userService.getUser(username)
    .then((user) => {
      done(null, user); // this will be available in req.user
    }).catch((err) => {
      done(err, null);
    });
});

// Session Setup to use it has storage for Passport
router.use(session({
  secret: 'f6efe2eb-3eda-4bdc-aa8c-2ba9d2d6bbe5',
  resave: false,
  saveUninitialized: false,
}));

// Passport Authentication Middleware
router.use(passport.initialize());
router.use(passport.session());

/*
 *  ROUTES
 */

// POST /sessions
// login
router.post('/', (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);

      // req.user contains the authenticated user, we send all the user info back
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current
// logout
router.delete('/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// GET /sessions/current
// check whether the user is logged in or not
router.get('/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: 'Unauthenticated user!' });
});

module.exports = router;
