const express = require('express');
const auth = require('../middleware/auth');
const { searchFoods } = require('../controllers/foodController');

const router = express.Router();

/**
 * @openapi
 * /api/foods:
 *   get:
 *     tags: [Foods]
 *     summary: Search foods by name
 *     description: Searches the local database, falling back to Open Food Facts when no local match is found.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string, minLength: 3 }
 *         description: Search query of at least 3 characters
 *     responses:
 *       200:
 *         description: Matching foods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Food' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/', auth, searchFoods);

module.exports = router;
