const { Router } = require('express');
const {
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/user.controller');
const { ensureAuth } = require('../middlewares/ensureAuth');

const router = Router();

router.post('/add', ensureAuth('ADMIN'), createUser);
router.post('/delete', ensureAuth('ADMIN'), deleteUser);
router.post('/update', ensureAuth('ADMIN'), updateUser);

module.exports = router;
