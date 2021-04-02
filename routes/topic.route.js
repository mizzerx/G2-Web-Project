const { Router } = require('express');
const { createTopic, updateTopic } = require('../controllers/topic.controller');
const { ensureAuth } = require('../middlewares/ensureAuth');

const router = Router();

router.post('/create', createTopic);
router.post('/edit', ensureAuth('ADMIN'), updateTopic);

module.exports = router;
