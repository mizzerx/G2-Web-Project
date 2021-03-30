const ensureAuth = (roleIn) => (req, res, next) => {
  if (!req.session.passport)
    return res.redirect(
      '/auth/login?msg="You are not logged in. Please login first"'
    );

  if (!req.isAuthenticated() && req.session.passport.user.role !== roleIn)
    return res.redirect('/auth/login?msg="You are not authorized."');

  next();
};

module.exports = { ensureAuth };
