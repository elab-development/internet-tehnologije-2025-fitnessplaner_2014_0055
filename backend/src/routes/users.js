const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { listUsers, updateUserRole } = require('../controllers/userController');

const router = express.Router();

router.get('/', auth, requireRole('admin'), listUsers);
router.patch('/:id/role', auth, requireRole('admin'), updateUserRole);

module.exports = router;
