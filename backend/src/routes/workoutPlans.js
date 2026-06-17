const express = require('express');
const auth = require('../middleware/auth');
const { getWorkoutPlansByDate, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan } = require('../controllers/workoutPlanController');

const router = express.Router();

router.get('/', auth, getWorkoutPlansByDate);
router.post('/', auth, createWorkoutPlan);
router.put('/:id', auth, updateWorkoutPlan);
router.delete('/:id', auth, deleteWorkoutPlan);

module.exports = router;
