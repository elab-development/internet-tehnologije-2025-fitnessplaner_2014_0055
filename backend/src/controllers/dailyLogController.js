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

async function updateDailyLog(req, res) {
  const userId = req.userId;
  const dailyLogId = Number(req.params.dailyLogId);
  const { hydration } = req.body;

  if (!isPositiveInteger(dailyLogId)) {
    return res.status(400).json({ message: 'invalid dailyLogId' });
  }

  if (hydration !== undefined && (!Number.isInteger(hydration) || hydration < 0)) {
    return res.status(400).json({ message: 'hydration must be a non-negative integer' });
  }

  const log = await DailyLog.findOne({ where: { id: dailyLogId, userId } });
  if (!log) {
    return res.status(404).json({ message: 'daily log not found' });
  }

  if (hydration !== undefined) {
    await log.update({ hydration });
  }

  return res.status(200).json(log);
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

async function recalculateDailyLogTotals(dailyLogId) {
  const entries = await FoodEntry.findAll({ where: { dailyLogId }, include: [Food] });
  const totals = entries.reduce((acc, entry) => {
    const factor = entry.grams / 100;
    acc.calories += (entry.Food.caloriesPer100g ?? 0) * factor;
    acc.protein += (entry.Food.proteinPer100g ?? 0) * factor;
    acc.carbs += (entry.Food.carbsPer100g ?? 0) * factor;
    acc.fat += (entry.Food.fatPer100g ?? 0) * factor;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  await DailyLog.update({
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
  }, { where: { id: dailyLogId } });
}

FoodEntry.addHook('afterCreate', (entry) => recalculateDailyLogTotals(entry.dailyLogId));
FoodEntry.addHook('afterUpdate', (entry) => recalculateDailyLogTotals(entry.dailyLogId));
FoodEntry.addHook('afterDestroy', (entry) => recalculateDailyLogTotals(entry.dailyLogId));

module.exports = { getDailyLogByDate, createDailyLog, updateDailyLog, addFoodEntry, updateFoodEntry, removeFoodEntry };
