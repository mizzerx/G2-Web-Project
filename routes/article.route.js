const { Router } = require('express');
const { upload } = require('../configs/multer.config');
const {
  createArticle,
  removeAricle,
  updateArticle,
  makeArticleFeedback,
} = require('../controllers/article.controller');
const { ensureAuth } = require('../middlewares/ensureAuth');

const router = Router();

router.post(
  '/create',
  ensureAuth('STUDENT'),
  upload.fields([{ name: 'images' }, { name: 'docs' }]),
  createArticle
);

router.post('/update', ensureAuth('STUDENT'), updateArticle);

router.post('/delete', ensureAuth('STUDENT'), removeAricle);

router.post('/feedback', ensureAuth('COORDINATOR'), makeArticleFeedback);

module.exports = router;
