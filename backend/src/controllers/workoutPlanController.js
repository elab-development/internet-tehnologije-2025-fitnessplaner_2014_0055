const { sequelize, WorkoutPlan, WorkoutItem, Exercise } = require('../models');

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

async function createWorkoutPlan(req, res) {
  const userId = req.userId;
  const { name, date, items } = req.body;

  if (!date) {
    return res.status(400).json({ message: 'date is required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items must contain at least one exercise' });
  }

  for (const item of items) {
    if (!item || item.exerciseId === undefined || !isPositiveInteger(item.sets) || !isPositiveInteger(item.reps)) {
      return res.status(400).json({
        message: 'each item requires exerciseId and positive integer sets and reps',
      });
    }
  }

  const exerciseIds = [...new Set(items.map((item) => item.exerciseId))];
  const existing = await Exercise.findAll({ where: { id: exerciseIds } });
  if (existing.length !== exerciseIds.length) {
    return res.status(400).json({ message: 'one or more exercises do not exist' });
  }

  try {
    const plan = await sequelize.transaction(async (transaction) => {
      const workoutPlan = await WorkoutPlan.create({ name, date, userId }, { transaction });

      await WorkoutItem.bulkCreate(
        items.map((item) => ({
          workoutPlanId: workoutPlan.id,
          exerciseId: item.exerciseId,
          sets: item.sets,
          reps: item.reps,
        })),
        { transaction },
      );

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

module.exports = { createWorkoutPlan };
