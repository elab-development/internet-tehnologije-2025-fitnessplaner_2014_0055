const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');
const authLimiter = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string, example: janedoe }
 *               email: { type: string, format: email, example: jane@example.com }
 *               password: { type: string, format: password, example: s3cret123 }
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       409:
 *         description: Username or email already in use
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/register', authLimiter, register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: jane@example.com }
 *               password: { type: string, format: password, example: s3cret123 }
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/login', authLimiter, login);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Revoke the current JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Logged out }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/logout', auth, logout);

module.exports = router;
