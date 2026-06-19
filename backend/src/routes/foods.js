const express = require('express');
const auth = require('../middleware/auth');
const { searchFoods } = require('../controllers/foodController');

const router = express.Router();

router.get('/', auth, searchFoods);

module.exports = router;
