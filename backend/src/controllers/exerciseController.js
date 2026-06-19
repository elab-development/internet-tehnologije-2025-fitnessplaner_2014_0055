const { Exercise } = require('../models');
const wger = require('../services/wgerClient');

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

async function getExercises(req, res) {
  const exercises = await Exercise.findAll();
  return res.status(200).json(exercises);
}

async function getExercise(req, res) {
  const id = Number(req.params.id);

  if (!isPositiveInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  const exercise = await Exercise.findByPk(id);
  if (!exercise) {
    return res.status(404).json({ message: 'exercise not found' });
  }

  const wgerInfo = await wger.getEnrichmentByName(exercise.name);

  return res.status(200).json({ ...exercise.toJSON(), wger: wgerInfo });
}

module.exports = { getExercises, getExercise };
