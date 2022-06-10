'use-strict';

const express = require('express');
const passport = require('passport');

const router = express.Router();

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
      // this is coming from userDao.getUser()
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
