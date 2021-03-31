const { Router } = require('express');
const { createTopic } = require('../controllers/topic.controller');

const router = Router();

router.post('/create', createTopic);

module.exports = router;
