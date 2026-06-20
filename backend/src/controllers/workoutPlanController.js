const { sequelize, WorkoutPlan, WorkoutItem, Exercise } = require('../models');

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

async function getWorkoutPlanByDate(req, res) {
  const userId = req.userId;
  const { date } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'valid date query param (YYYY-MM-DD) is required' });
  }

  const plan = await WorkoutPlan.findOne({ where: { date, userId }, include: [WorkoutItem] });
  return res.status(200).json(plan);
}

async function getWorkoutPlanById(req, res) {
  const userId = req.userId;
  const id = Number(req.params.id);

  if (!isPositiveInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  const plan = await WorkoutPlan.findOne({
    where: { id, userId },
    include: [{ model: WorkoutItem, include: [Exercise] }],
  });

  if (!plan) {
    return res.status(404).json({ message: 'workout plan not found' });
  }

  return res.status(200).json(plan);
}

async function createWorkoutPlan(req, res) {
  const userId = req.userId;
  const { name, date } = req.body;
  const items = req.body.items ?? [];

  if (!date) {
    return res.status(400).json({ message: 'date is required' });
  }

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: 'items must be an array' });
  }

  for (const item of items) {
    if (!item || item.exerciseId === undefined || !isPositiveInteger(item.sets) || !isPositiveInteger(item.reps)) {
      return res.status(400).json({
        message: 'each item requires exerciseId and positive integer sets and reps',
      });
    }
  }

  if (items.length > 0) {
    const exerciseIds = [...new Set(items.map((item) => item.exerciseId))];
    const existing = await Exercise.findAll({ where: { id: exerciseIds } });
    if (existing.length !== exerciseIds.length) {
      return res.status(400).json({ message: 'one or more exercises do not exist' });
    }
  }

  try {
    const plan = await sequelize.transaction(async (transaction) => {
      const workoutPlan = await WorkoutPlan.create({ name, date, userId }, { transaction });

      if (items.length > 0) {
        await WorkoutItem.bulkCreate(
          items.map((item) => ({
            workoutPlanId: workoutPlan.id,
            exerciseId: item.exerciseId,
            sets: item.sets,
            reps: item.reps,
          })),
          { transaction },
        );
      }

      return WorkoutPlan.findByPk(workoutPlan.id, {
        include: [WorkoutItem],
        transaction,
      });
    });

    return res.status(201).json(plan);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'a workout already exists for this date' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Invalid input' });
    }
    throw err;
  }
}

async function updateWorkoutPlan(req, res) {
  const userId = req.userId;
  const id = Number(req.params.id);
  const { name, date } = req.body;

  if (!isPositiveInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  if (!date) {
    return res.status(400).json({ message: 'date is required' });
  }

  const plan = await WorkoutPlan.findOne({ where: { id, userId } });
  if (!plan) {
    return res.status(404).json({ message: 'workout plan not found' });
  }

  try {
    await WorkoutPlan.update({ name, date }, { where: { id } });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'a workout already exists for this date' });
    }
    throw err;
  }

  const updated = await WorkoutPlan.findByPk(id, { include: [WorkoutItem] });
  return res.status(200).json(updated);
}

async function addWorkoutItem(req, res) {
  const userId = req.userId;
  const workoutPlanId = Number(req.params.workoutPlanId);
  const { exerciseId, sets, reps } = req.body;

  if (!isPositiveInteger(workoutPlanId)) {
    return res.status(400).json({ message: 'invalid workoutPlanId' });
  }

  if (!isPositiveInteger(exerciseId)) {
    return res.status(400).json({ message: 'exerciseId must be a positive integer' });
  }

  if (!isPositiveInteger(sets) || !isPositiveInteger(reps)) {
    return res.status(400).json({ message: 'sets and reps must be positive integers' });
  }

  const plan = await WorkoutPlan.findOne({ where: { id: workoutPlanId, userId } });
  if (!plan) {
    return res.status(404).json({ message: 'workout plan not found' });
  }

  const exercise = await Exercise.findByPk(exerciseId);
  if (!exercise) {
    return res.status(400).json({ message: 'exercise does not exist' });
  }

  const item = await WorkoutItem.create({ workoutPlanId, exerciseId, sets, reps });

  const created = await WorkoutItem.findByPk(item.id, { include: [Exercise] });
  return res.status(201).json(created);
}

async function updateWorkoutItem(req, res) {
  const userId = req.userId;
  const workoutPlanId = Number(req.params.workoutPlanId);
  const itemId = Number(req.params.itemId);
  const { sets, reps } = req.body;

  if (!isPositiveInteger(workoutPlanId)) {
    return res.status(400).json({ message: 'invalid workoutPlanId' });
  }

  if (!isPositiveInteger(itemId)) {
    return res.status(400).json({ message: 'invalid itemId' });
  }

  if (!isPositiveInteger(sets) || !isPositiveInteger(reps)) {
    return res.status(400).json({ message: 'sets and reps must be positive integers' });
  }

  const plan = await WorkoutPlan.findOne({ where: { id: workoutPlanId, userId } });
  if (!plan) {
    return res.status(404).json({ message: 'workout plan not found' });
  }

  const item = await WorkoutItem.findOne({ where: { id: itemId, workoutPlanId } });
  if (!item) {
    return res.status(404).json({ message: 'workout item not found' });
  }

  await item.update({ sets, reps });

  const updated = await WorkoutItem.findByPk(item.id, { include: [Exercise] });
  return res.status(200).json(updated);
}

async function removeWorkoutItem(req, res) {
  const userId = req.userId;
  const workoutPlanId = Number(req.params.workoutPlanId);
  const itemId = Number(req.params.itemId);

  if (!isPositiveInteger(workoutPlanId)) {
    return res.status(400).json({ message: 'invalid workoutPlanId' });
  }

  if (!isPositiveInteger(itemId)) {
    return res.status(400).json({ message: 'invalid itemId' });
  }

  const plan = await WorkoutPlan.findOne({ where: { id: workoutPlanId, userId } });
  if (!plan) {
    return res.status(404).json({ message: 'workout plan not found' });
  }

  const item = await WorkoutItem.findOne({ where: { id: itemId, workoutPlanId } });
  if (!item) {
    return res.status(404).json({ message: 'workout item not found' });
  }

  await item.destroy();

  return res.status(204).end();
}

async function deleteWorkoutPlan(req, res) {
  const userId = req.userId;
  const id = Number(req.params.id);

  if (!isPositiveInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  const deleted = await WorkoutPlan.destroy({ where: { id, userId } });
  if (deleted === 0) {
    return res.status(404).json({ message: 'workout plan not found' });
  }

  return res.status(204).end();
}

module.exports = {
  getWorkoutPlanByDate,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  addWorkoutItem,
  updateWorkoutItem,
  removeWorkoutItem,
};
