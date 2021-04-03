const { Router } = require('express');
const {
  createArticle,
  removeAricle,
  updateArticle,
  makeArticleFeedback,
} = require('../controllers/article.controller');
const { ensureAuth } = require('../middlewares/ensureAuth');

const router = Router();

router.post('/create', ensureAuth('STUDENT'), createArticle);

router.post('/update', ensureAuth('STUDENT'), updateArticle);

router.post('/delete', ensureAuth('STUDENT'), removeAricle);

router.post('/feedback', ensureAuth('COORDINATOR'), makeArticleFeedback);

module.exports = router;
