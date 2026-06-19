const express = require('express');
const auth = require('../middleware/auth');
const {
  getWorkoutPlansByDate,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  addWorkoutItem,
  updateWorkoutItem,
  removeWorkoutItem,
} = require('../controllers/workoutPlanController');

const router = express.Router();

router.get('/', auth, getWorkoutPlansByDate);
router.post('/', auth, createWorkoutPlan);
router.put('/:id', auth, updateWorkoutPlan);
router.delete('/:id', auth, deleteWorkoutPlan);
router.post('/:workoutPlanId/exercise', auth, addWorkoutItem);
router.patch('/:workoutPlanId/exercise/:itemId', auth, updateWorkoutItem);
router.delete('/:workoutPlanId/exercise/:itemId', auth, removeWorkoutItem);

module.exports = router;
