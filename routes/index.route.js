const { Router } = require('express');
const { ensureAuth } = require('../middlewares/ensureAuth');
const User = require('../models/user.model');

const router = Router();

router.get('/', (req, res) => {
  return res.render('home');
});

router.get('/student/profile', ensureAuth('STUDENT'), async (req, res) => {
  const { user } = req.session.passport;

  const findUser = await User.findById(user._id)
    .populate('uploadedArticles')
    .populate('uploadedImages')
    .populate('faculty')
    .lean();
  return res.render('profile', { user: findUser });
});

router.get('/admin', ensureAuth('ADMIN'), async (req, res) => {
  try {
    const users = await User.find().limit(100).populate('faculty').lean();

    console.log(users);

    return res.render('admin', { users });
  } catch (error) {
    next(error);
  }
});

router.get('/coordinator', ensureAuth('COORDINATOR'), (req, res) => {
  return res.render('coordinator');
});

router.get('/manger', ensureAuth('MANAGER'), (req, res) => {
  return res.render('manager');
});

router.get('/student/article/create', (req, res) => {
  return res.render('articles/create');
});

module.exports = router;
