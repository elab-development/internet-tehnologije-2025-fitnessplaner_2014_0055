const express = require('express');
const auth = require('../middleware/auth');
const {
  getWorkoutPlanByDate,
  getWorkoutPlansInRange,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  addWorkoutItem,
  updateWorkoutItem,
  removeWorkoutItem,
} = require('../controllers/workoutPlanController');

const router = express.Router();

/**
 * @openapi
 * /api/workout-plans:
 *   get:
 *     tags: [Workout Plans]
 *     summary: Get the workout plan for a given date
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: The workout plan, or null if none exists for that date
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/WorkoutPlan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/', auth, getWorkoutPlanByDate);

/**
 * @openapi
 * /api/workout-plans/range:
 *   get:
 *     tags: [Workout Plans]
 *     summary: Get workout plans within a date range
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         required: true
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: List of workout plans ordered by date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/WorkoutPlan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/range', auth, getWorkoutPlansInRange);

/**
 * @openapi
 * /api/workout-plans/{id}:
 *   get:
 *     tags: [Workout Plans]
 *     summary: Get a workout plan by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The workout plan
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/WorkoutPlan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', auth, getWorkoutPlanById);

/**
 * @openapi
 * /api/workout-plans:
 *   post:
 *     tags: [Workout Plans]
 *     summary: Create a workout plan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date]
 *             properties:
 *               name: { type: string, example: Push Day }
 *               date: { type: string, format: date, example: '2026-06-22' }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [exerciseId, sets, reps]
 *                   properties:
 *                     exerciseId: { type: integer, example: 1 }
 *                     sets: { type: integer, example: 3 }
 *                     reps: { type: integer, example: 10 }
 *     responses:
 *       201:
 *         description: Created workout plan
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/WorkoutPlan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       409:
 *         description: A workout already exists for this date
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/', auth, createWorkoutPlan);

/**
 * @openapi
 * /api/workout-plans/{id}:
 *   put:
 *     tags: [Workout Plans]
 *     summary: Update a workout plan's name or date
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
 *             required: [date]
 *             properties:
 *               name: { type: string, example: Pull Day }
 *               date: { type: string, format: date, example: '2026-06-23' }
 *     responses:
 *       200:
 *         description: Updated workout plan
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/WorkoutPlan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409:
 *         description: A workout already exists for this date
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.put('/:id', auth, updateWorkoutPlan);

/**
 * @openapi
 * /api/workout-plans/{id}:
 *   delete:
 *     tags: [Workout Plans]
 *     summary: Delete a workout plan
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
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:id', auth, deleteWorkoutPlan);

/**
 * @openapi
 * /api/workout-plans/{workoutPlanId}/exercise:
 *   post:
 *     tags: [Workout Plans]
 *     summary: Add an exercise to a workout plan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutPlanId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exerciseId, sets, reps]
 *             properties:
 *               exerciseId: { type: integer, example: 1 }
 *               sets: { type: integer, example: 3 }
 *               reps: { type: integer, example: 10 }
 *     responses:
 *       201:
 *         description: Created workout item
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/WorkoutItem' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.post('/:workoutPlanId/exercise', auth, addWorkoutItem);

/**
 * @openapi
 * /api/workout-plans/{workoutPlanId}/exercise/{itemId}:
 *   patch:
 *     tags: [Workout Plans]
 *     summary: Update sets and reps of a workout item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutPlanId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sets, reps]
 *             properties:
 *               sets: { type: integer, example: 4 }
 *               reps: { type: integer, example: 8 }
 *     responses:
 *       200:
 *         description: Updated workout item
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/WorkoutItem' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.patch('/:workoutPlanId/exercise/:itemId', auth, updateWorkoutItem);

/**
 * @openapi
 * /api/workout-plans/{workoutPlanId}/exercise/{itemId}:
 *   delete:
 *     tags: [Workout Plans]
 *     summary: Remove a workout item from a plan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutPlanId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:workoutPlanId/exercise/:itemId', auth, removeWorkoutItem);

module.exports = router;
