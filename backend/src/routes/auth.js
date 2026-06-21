const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');
const authLimiter = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', auth, logout);

module.exports = router;
