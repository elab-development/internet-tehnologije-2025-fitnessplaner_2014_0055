const express = require('express');
const auth = require('../middleware/auth');
const { getDailyLogByDate } = require('../controllers/dailyLogController');

const router = express.Router();

router.get('/', auth, getDailyLogByDate);

module.exports = router;
