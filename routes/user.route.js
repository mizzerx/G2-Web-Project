const { Router } = require('express');
const { createUser, deleteUser } = require('../controllers/user.controller');

const router = Router();

router.post('/add', createUser);
router.post('/delete', deleteUser);

module.exports = router;
