const express = require('express');
const { getExercises, getExercise } = require('../controllers/exerciseController');

const router = express.Router();

router.get('/', getExercises);
router.get('/:id', getExercise);

module.exports = router;
