const express = require('express');
const { getExercises } = require('../controllers/exerciseController');

const router = express.Router();

router.get('/', getExercises);

module.exports = router;
