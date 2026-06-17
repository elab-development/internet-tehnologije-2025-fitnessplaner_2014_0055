const express = require('express');
const auth = require('../middleware/auth');
const { createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan } = require('../controllers/workoutPlanController');

const router = express.Router();

router.post('/', auth, createWorkoutPlan);
router.put('/:id', auth, updateWorkoutPlan);
router.delete('/:id', auth, deleteWorkoutPlan);

module.exports = router;
