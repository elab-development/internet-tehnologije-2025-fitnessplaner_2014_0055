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

async function createExercise(req, res) {
  const { name, muscles, description, videoURL } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'name is required' });
  }

  if (muscles !== undefined && !Array.isArray(muscles)) {
    return res.status(400).json({ message: 'muscles must be an array' });
  }

  try {
    const exercise = await Exercise.create({ name, muscles, description, videoURL });
    return res.status(201).json(exercise);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'an exercise with this name already exists' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Invalid input' });
    }
    throw err;
  }
}

async function updateExercise(req, res) {
  const id = Number(req.params.id);
  const { name, muscles, description, videoURL } = req.body;

  if (!isPositiveInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  if (muscles !== undefined && !Array.isArray(muscles)) {
    return res.status(400).json({ message: 'muscles must be an array' });
  }

  const exercise = await Exercise.findByPk(id);
  if (!exercise) {
    return res.status(404).json({ message: 'exercise not found' });
  }

  try {
    await exercise.update({ name, muscles, description, videoURL });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'an exercise with this name already exists' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Invalid input' });
    }
    throw err;
  }

  return res.status(200).json(exercise);
}

async function deleteExercise(req, res) {
  const id = Number(req.params.id);

  if (!isPositiveInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  const deleted = await Exercise.destroy({ where: { id } });
  if (deleted === 0) {
    return res.status(404).json({ message: 'exercise not found' });
  }

  return res.status(204).end();
}

module.exports = { getExercises, getExercise, createExercise, updateExercise, deleteExercise };
