const { sequelize, WorkoutPlan, WorkoutItem, Exercise } = require('../models');

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

async function getWorkoutPlansByDate(req, res) {
  const userId = req.userId;
  const { date } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'valid date query param (YYYY-MM-DD) is required' });
  }

  const plans = await WorkoutPlan.findAll({ where: { date, userId }, include: [WorkoutItem] });
  return res.status(200).json(plans);
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
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Invalid input' });
    }
    throw err;
  }
}

async function updateWorkoutPlan(req, res) {
  const userId = req.userId;
  const id = Number(req.params.id);
  const { name, date} = req.body;
  const items = req.body.items ?? [];

  if (!isPositiveInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

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
    if (item.id !== undefined && !isPositiveInteger(item.id)) {
      return res.status(400).json({ message: 'invalid item id' });
    }
  }

  const plan = await WorkoutPlan.findOne({ where: { id, userId }, include: [WorkoutItem] });
  if (!plan) {
    return res.status(404).json({ message: 'workout plan not found' });
  }

  const exerciseIds = [...new Set(items.map((item) => item.exerciseId))];
  if (exerciseIds.length > 0) {
    const existing = await Exercise.findAll({ where: { id: exerciseIds } });
    if (existing.length !== exerciseIds.length) {
      return res.status(400).json({ message: 'one or more exercises do not exist' });
    }
  }

  const existingItemIds = new Set(plan.WorkoutItems.map((item) => item.id));
  if (items.some((item) => item.id !== undefined && !existingItemIds.has(item.id))) {
    return res.status(400).json({ message: 'one or more items do not belong to this plan' });
  }

  const toUpdate = items.filter((item) => item.id !== undefined);
  const toCreate = items.filter((item) => item.id === undefined);
  const incomingItemIds = new Set(toUpdate.map((item) => item.id));
  const toDeleteIds = [...existingItemIds].filter((itemId) => !incomingItemIds.has(itemId));

  try {
    const updated = await sequelize.transaction(async (transaction) => {
      await WorkoutPlan.update({ name, date }, { where: { id }, transaction });

      if (toDeleteIds.length > 0) {
        await WorkoutItem.destroy({ where: { id: toDeleteIds }, transaction });
      }

      for (const item of toUpdate) {
        await WorkoutItem.update(
          { exerciseId: item.exerciseId, sets: item.sets, reps: item.reps },
          { where: { id: item.id }, transaction },
        );
      }

      if (toCreate.length > 0) {
        await WorkoutItem.bulkCreate(
          toCreate.map((item) => ({
            workoutPlanId: id,
            exerciseId: item.exerciseId,
            sets: item.sets,
            reps: item.reps,
          })),
          { transaction },
        );
      }

      return WorkoutPlan.findByPk(id, { include: [WorkoutItem], transaction });
    });

    return res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Invalid input' });
    }
    throw err;
  }
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

module.exports = { getWorkoutPlansByDate, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan };
