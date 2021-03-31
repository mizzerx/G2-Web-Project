const { Router } = require('express');
const { upload } = require('../configs/multer.config');
const { createArticle } = require('../controllers/article.controller');
const { ensureAuth } = require('../middlewares/ensureAuth');

const router = Router();

router.post(
  '/create',
  ensureAuth('STUDENT'),
  upload.fields([{ name: 'images' }, { name: 'docs' }]),
  createArticle
);

module.exports = router;
