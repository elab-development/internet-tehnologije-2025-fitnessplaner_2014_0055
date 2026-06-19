const { DailyLog, FoodEntry, Food } = require('../models');

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

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

async function createDailyLog(req, res) {
  const userId = req.userId;
  const { date } = req.body;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'valid date (YYYY-MM-DD) is required' });
  }

  const existing = await DailyLog.findOne({ where: { date, userId } });
  if (existing) {
    return res.status(409).json({ message: 'daily log for this date already exists' });
  }

  const log = await DailyLog.create({ date, userId });

  return res.status(201).json(log);
}

async function addFoodEntry(req, res) {
  const userId = req.userId;
  const dailyLogId = Number(req.params.dailyLogId);
  const { foodId, grams } = req.body;

  if (!isPositiveInteger(dailyLogId)) {
    return res.status(400).json({ message: 'invalid dailyLogId' });
  }

  if (!isPositiveInteger(foodId)) {
    return res.status(400).json({ message: 'foodId must be a positive integer' });
  }

  if (typeof grams !== 'number' || !Number.isFinite(grams) || grams <= 0) {
    return res.status(400).json({ message: 'grams must be a positive number' });
  }

  const log = await DailyLog.findOne({ where: { id: dailyLogId, userId } });
  if (!log) {
    return res.status(404).json({ message: 'daily log not found' });
  }

  const food = await Food.findByPk(foodId);
  if (!food) {
    return res.status(400).json({ message: 'food does not exist' });
  }

  const entry = await FoodEntry.create({ dailyLogId, foodId, grams });

  const created = await FoodEntry.findByPk(entry.id, { include: [Food] });
  return res.status(201).json(created);
}

async function updateFoodEntry(req, res) {
  const userId = req.userId;
  const dailyLogId = Number(req.params.dailyLogId);
  const entryId = Number(req.params.entryId);
  const { grams } = req.body;

  if (!isPositiveInteger(dailyLogId)) {
    return res.status(400).json({ message: 'invalid dailyLogId' });
  }

  if (!isPositiveInteger(entryId)) {
    return res.status(400).json({ message: 'invalid entryId' });
  }

  if (typeof grams !== 'number' || !Number.isFinite(grams) || grams <= 0) {
    return res.status(400).json({ message: 'grams must be a positive number' });
  }

  const log = await DailyLog.findOne({ where: { id: dailyLogId, userId } });
  if (!log) {
    return res.status(404).json({ message: 'daily log not found' });
  }

  const entry = await FoodEntry.findOne({ where: { id: entryId, dailyLogId } });
  if (!entry) {
    return res.status(404).json({ message: 'food entry not found' });
  }

  await entry.update({ grams });

  const updated = await FoodEntry.findByPk(entry.id, { include: [Food] });
  return res.status(200).json(updated);
}

async function removeFoodEntry(req, res) {
  const userId = req.userId;
  const dailyLogId = Number(req.params.dailyLogId);
  const entryId = Number(req.params.entryId);

  if (!isPositiveInteger(dailyLogId)) {
    return res.status(400).json({ message: 'invalid dailyLogId' });
  }

  if (!isPositiveInteger(entryId)) {
    return res.status(400).json({ message: 'invalid entryId' });
  }

  const log = await DailyLog.findOne({ where: { id: dailyLogId, userId } });
  if (!log) {
    return res.status(404).json({ message: 'daily log not found' });
  }

  const entry = await FoodEntry.findOne({ where: { id: entryId, dailyLogId } });
  if (!entry) {
    return res.status(404).json({ message: 'food entry not found' });
  }

  await entry.destroy();

  return res.status(204).end();
}

module.exports = { getDailyLogByDate, createDailyLog, addFoodEntry, updateFoodEntry, removeFoodEntry };
