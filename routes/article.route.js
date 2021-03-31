const { Router } = require('express');
const { upload } = require('../configs/multer.config');
const {
  createArticle,
  removeAricle,
} = require('../controllers/article.controller');
const { ensureAuth } = require('../middlewares/ensureAuth');

const router = Router();

router.post(
  '/create',
  ensureAuth('STUDENT'),
  upload.fields([{ name: 'images' }, { name: 'docs' }]),
  createArticle
);

router.post('/delete', ensureAuth('STUDENT'), removeAricle);

module.exports = router;
