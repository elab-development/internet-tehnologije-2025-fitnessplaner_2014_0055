const { sequelize, WorkoutPlan, WorkoutItem, Exercise } = require('../models');

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
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

module.exports = { createWorkoutPlan, deleteWorkoutPlan };
