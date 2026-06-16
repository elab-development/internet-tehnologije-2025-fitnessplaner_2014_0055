const express = require('express');
const auth = require('../middleware/auth');
const { createWorkoutPlan } = require('../controllers/workoutPlanController');

const router = express.Router();

router.post('/', auth, createWorkoutPlan);

module.exports = router;
