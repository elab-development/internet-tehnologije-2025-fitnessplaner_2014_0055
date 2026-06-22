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

/**
 * @openapi
 * /api/exercises:
 *   get:
 *     tags: [Exercises]
 *     summary: List all exercises
 *     responses:
 *       200:
 *         description: List of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Exercise' }
 */
router.get('/', getExercises);

/**
 * @openapi
 * /api/exercises/{id}:
 *   get:
 *     tags: [Exercises]
 *     summary: Get an exercise by id, enriched with wger data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The exercise with additional wger enrichment
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Exercise'
 *                 - type: object
 *                   properties:
 *                     wger:
 *                       type: object
 *                       nullable: true
 *                       description: Enrichment data from the wger API
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', getExercise);

/**
 * @openapi
 * /api/exercises:
 *   post:
 *     tags: [Exercises]
 *     summary: Create an exercise (trainer or admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Bench Press }
 *               muscles: { type: string, example: 'chest, triceps' }
 *               description: { type: string }
 *               videoId: { type: string, example: rT7DgCr-3pg }
 *     responses:
 *       201:
 *         description: Created exercise
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Exercise' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403:
 *         description: Insufficient role
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: An exercise with this name already exists
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/', auth, requireRole('trainer', 'admin'), createExercise);

/**
 * @openapi
 * /api/exercises/{id}:
 *   put:
 *     tags: [Exercises]
 *     summary: Update an exercise (trainer or admin only)
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
 *             properties:
 *               name: { type: string, example: Incline Bench Press }
 *               muscles: { type: string, example: 'chest, shoulders' }
 *               description: { type: string }
 *               videoId: { type: string }
 *     responses:
 *       200:
 *         description: Updated exercise
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Exercise' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403:
 *         description: Insufficient role
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409:
 *         description: An exercise with this name already exists
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.put('/:id', auth, requireRole('trainer', 'admin'), updateExercise);

/**
 * @openapi
 * /api/exercises/{id}:
 *   delete:
 *     tags: [Exercises]
 *     summary: Delete an exercise (trainer or admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403:
 *         description: Insufficient role
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:id', auth, requireRole('trainer', 'admin'), deleteExercise);

module.exports = router;
