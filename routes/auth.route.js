const { Router } = require('express');
const passport = require('passport');

const router = Router();

router.get('/login', (req, res) => {
  return res.render('login', { error: req.query.msg });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/login?msg="Wrong username or password"',
  }),
  (req, res) => {
    switch (req.user.role) {
      case 'ADMIN':
        res.redirect('/admin');
        break;
      case 'STUDENT':
        res.redirect('/student/profile');
        break;
      case 'COORDINATOOR':
        res.redirect('/coordinator');
        break;
      case 'MANAGER':
        res.redirect('/manager');
        break;
      default:
        res.redirect('/');
        break;
    }
  }
);

module.exports = router;
