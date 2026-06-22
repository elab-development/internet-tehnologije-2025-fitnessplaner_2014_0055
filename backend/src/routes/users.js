const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { listUsers, updateUserRole } = require('../controllers/userController');

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403:
 *         description: Insufficient role
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/', auth, requireRole('admin'), listUsers);

/**
 * @openapi
 * /api/users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Change a user's role (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [user, trainer, admin], example: trainer }
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403:
 *         description: Insufficient role or attempting to change your own role
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.patch('/:id/role', auth, requireRole('admin'), updateUserRole);

module.exports = router;
