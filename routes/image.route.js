const { Router } = require('express');
const { upload } = require('../configs/multer.config');
const { uploadImages } = require('../controllers/image.controller');
const { ensureAuth } = require('../middlewares/ensureAuth');

const router = Router();

router.post(
  '/upload',
  ensureAuth('STUDENT'),
  upload.array('images', 10),
  uploadImages
);

module.exports = router;
