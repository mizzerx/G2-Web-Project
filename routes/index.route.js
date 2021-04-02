const { Router } = require('express');
const { ensureAuth } = require('../middlewares/ensureAuth');
const User = require('../models/user.model');
const Article = require('../models/article.model');
const Topic = require('../models/topic.model');

const router = Router();

router.get('/', async (req, res) => {
  const articles = await Article.find({ status: 'ACCEPTED' })
    .limit(100)
    .populate('owner')
    .lean();
  return res.render('home', { articles });
});

router.get('/student/profile', ensureAuth('STUDENT'), async (req, res) => {
  const { user } = req.session.passport;

  const findUser = await User.findById(user._id)
    .populate('uploadedArticles')
    .populate('uploadedImages')
    .lean();

  console.log(findUser);
  return res.render('profile', { user: findUser });
});

router.get('/admin', ensureAuth('ADMIN'), async (req, res, next) => {
  try {
    const users = await User.find().limit(100).lean();
    const topics = await Topic.find().limit(100).lean();

    return res.render('admin', { users, topics });
  } catch (error) {
    next(error);
  }
});

router.get('/coordinator', ensureAuth('COORDINATOR'), async (req, res) => {
  const { user } = req.session.passport;
  const article = await Article.find({ faculty: user.faculty })
    .limit(100)
    .lean();
  return res.render('coordinator', { article, faculty: user.faculty });
});

router.get('/manger', ensureAuth('MANAGER'), (req, res) => {
  return res.render('manager');
});

router.get('/student/article/create', (req, res) => {
  return res.render('articles/create');
});

router.get('/student/article/update', async (req, res) => {
  const { id } = req.query;

  const article = await Article.findById(id).lean();

  return res.render('articles/update', { article });
});

router.get(
  '/article/feedback',
  ensureAuth('COORDINATOR'),
  async (req, res, next) => {
    const { usr_id, art_id } = req.query;

    const user = await User.findById(usr_id).lean();
    const article = await Article.findById(art_id).lean();

    return res.render('articles/feedback', {
      user,
      article,
    });
  }
);

router.get('/topic/edit', ensureAuth('ADMIN'), async (req, res) => {
  const { id } = req.query;

  const topic = await Topic.findOne({ _id: id }).lean();

  return res.render('topics/edit', { topic });
});

module.exports = router;
