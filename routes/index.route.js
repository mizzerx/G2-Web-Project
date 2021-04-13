const { Router } = require('express');
const { ensureAuth } = require('../middlewares/ensureAuth');
const User = require('../models/user.model');
const Article = require('../models/article.model');
const Topic = require('../models/topic.model');
const Faculty = require('../models/faculty.model');
const { zipAndDownload } = require('../controllers/download.controller');

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

  return res.render('profile', { user: findUser });
});

router.get('/admin', ensureAuth('ADMIN'), async (req, res, next) => {
  try {
    const users = await User.find().limit(100).lean();
    const topics = await Topic.find().limit(100).lean();

    console.log(topics);

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

router.get('/manager', ensureAuth('MANAGER'), async (req, res) => {
  const users = await User.find();
  const itStudent = users.filter(
    (user) => user.faculty === 'IT' && user.role === 'STUDENT'
  ).length;

  const bsStudent = users.filter(
    (user) => user.faculty === 'BS' && user.role === 'STUDENT'
  ).length;

  const dsStudent = users.filter(
    (user) => user.faculty === 'DS' && user.role === 'STUDENT'
  ).length;

  const itCoor = users.filter(
    (user) => user.faculty === 'IT' && user.role === 'COORDINATOR'
  ).length;

  const bsCoor = users.filter(
    (user) => user.faculty === 'BS' && user.role === 'COORDINATOR'
  ).length;

  const dsCoor = users.filter(
    (user) => user.faculty === 'DS' && user.role === 'COORDINATOR'
  ).length;

  const articles = await Article.find().lean();
  const itArt = articles.filter((user) => user.faculty === 'IT').length;

  const bsArt = articles.filter((user) => user.faculty === 'BS').length;

  const dsArt = articles.filter((user) => user.faculty === 'DS').length;

  articlesData = articles.filter((article) => article.status === 'ACCEPTED');

  return res.render('manager', {
    itStudent,
    bsStudent,
    dsStudent,
    studentTotal: itStudent + bsStudent + dsStudent,
    itCoor,
    bsCoor,
    dsCoor,
    coorTotal: itCoor + bsCoor + dsCoor,
    itArt,
    bsArt,
    dsArt,
    artTotal: itArt + bsArt + dsArt,
    articlesData,
  });
});

router.get('/student/article/create', async (req, res) => {
  const { user } = req.session.passport;
  const faculty = await Faculty.findOne({ name: user.faculty })
    .populate('topics')
    .lean();

  return res.render('articles/create', { topics: faculty.topics });
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

router.get('/student/image/upload', ensureAuth('STUDENT'), (req, res) => {
  return res.render('images/upload');
});

router.get('/download', ensureAuth('MANAGER'), zipAndDownload);

router.get('/user/update', ensureAuth('ADMIN'), async (req, res) => {
  const { id } = req.query;

  return res.render('users/update', { id });
});

router.get('/contact', (req, res) => {
  return res.render('contact');
});

router.get('/articles/detail',async (req, res) => {
  const { q } = req.query;

  const article = await Article.findOne({_id: q}).lean();

  return res.render('articles/detail', {article});
});

module.exports = router;
