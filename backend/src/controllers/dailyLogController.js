const { DailyLog, FoodEntry, Food } = require('../models');

async function getDailyLogByDate(req, res) {
  const userId = req.userId;
  const { date } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'valid date query param (YYYY-MM-DD) is required' });
  }

  const log = await DailyLog.findOne({
    where: { date, userId },
    include: [{ model: FoodEntry, include: [Food] }],
  });

  return res.status(200).json(log);
}

module.exports = { getDailyLogByDate };
