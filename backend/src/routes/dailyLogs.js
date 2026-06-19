const express = require('express');
const auth = require('../middleware/auth');
const { getDailyLogByDate, addFoodEntry, updateFoodEntry, removeFoodEntry } = require('../controllers/dailyLogController');

const router = express.Router();

router.get('/', auth, getDailyLogByDate);
router.post('/:dailyLogId/food', auth, addFoodEntry);
router.patch('/:dailyLogId/food/:entryId', auth, updateFoodEntry);
router.delete('/:dailyLogId/food/:entryId', auth, removeFoodEntry);

module.exports = router;
