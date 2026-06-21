const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
} = require('../controllers/exerciseController');

const router = express.Router();

router.get('/', getExercises);
router.get('/:id', getExercise);
router.post('/', auth, requireRole('trainer', 'admin'), createExercise);
router.put('/:id', auth, requireRole('trainer', 'admin'), updateExercise);
router.delete('/:id', auth, requireRole('trainer', 'admin'), deleteExercise);

module.exports = router;
