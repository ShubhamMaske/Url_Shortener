const express = require('express');
const { createShortUrl, redirectUrl } = require('../controllers/urlController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createShortUrl);
router.get('/:alias', redirectUrl);

module.exports = router;