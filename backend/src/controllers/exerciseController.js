const { Exercise } = require('../models');

async function getExercises(req, res) {
  const exercises = await Exercise.findAll();
  return res.status(200).json(exercises);
}

module.exports = { getExercises };
