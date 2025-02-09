const express = require('express');
const { getAnalytics, getTopicsAnalytics, allURLAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:alias', authMiddleware, getAnalytics);
router.get('/topic/:topic', authMiddleware, getTopicsAnalytics);
router.get('/fullanalytics', authMiddleware, allURLAnalytics);

module.exports = router;