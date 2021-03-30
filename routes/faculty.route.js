const { Router } = require('express');
const { createFaculty } = require('../controllers/faculty.controller');

const router = Router();

router.post('/', createFaculty);

module.exports = router;
