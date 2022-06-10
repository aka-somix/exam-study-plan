const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: 'Error. User Not Authenticated' });
};

module.exports = isLoggedIn;
