const express = require('express');
const auth = require('../middleware/auth');
const { createWorkoutPlan, deleteWorkoutPlan } = require('../controllers/workoutPlanController');

const router = express.Router();

router.post('/', auth, createWorkoutPlan);
router.delete('/:id', auth, deleteWorkoutPlan);

module.exports = router;
