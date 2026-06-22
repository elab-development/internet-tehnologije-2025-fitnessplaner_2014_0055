const express = require('express');
const auth = require('../middleware/auth');
const { getDailyLogByDate, createDailyLog, updateDailyLog, addFoodEntry, updateFoodEntry, removeFoodEntry } = require('../controllers/dailyLogController');

const router = express.Router();

/**
 * @openapi
 * /api/daily-logs:
 *   get:
 *     tags: [Daily Logs]
 *     summary: Get the daily log for a given date
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: The daily log, or null if none exists for that date
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DailyLog' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/', auth, getDailyLogByDate);

/**
 * @openapi
 * /api/daily-logs:
 *   post:
 *     tags: [Daily Logs]
 *     summary: Create a daily log
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
 *               date: { type: string, format: date, example: '2026-06-22' }
 *     responses:
 *       201:
 *         description: Created daily log
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DailyLog' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       409:
 *         description: A daily log for this date already exists
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/', auth, createDailyLog);

/**
 * @openapi
 * /api/daily-logs/{dailyLogId}:
 *   patch:
 *     tags: [Daily Logs]
 *     summary: Update a daily log's hydration
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dailyLogId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hydration: { type: integer, example: 2000, description: Hydration in millilitres }
 *     responses:
 *       200:
 *         description: Updated daily log
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DailyLog' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.patch('/:dailyLogId', auth, updateDailyLog);

/**
 * @openapi
 * /api/daily-logs/{dailyLogId}/food:
 *   post:
 *     tags: [Daily Logs]
 *     summary: Add a food entry to a daily log
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dailyLogId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [foodId, grams]
 *             properties:
 *               foodId: { type: integer, example: 1 }
 *               grams: { type: number, format: float, example: 150 }
 *     responses:
 *       201:
 *         description: Created food entry
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FoodEntry' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.post('/:dailyLogId/food', auth, addFoodEntry);

/**
 * @openapi
 * /api/daily-logs/{dailyLogId}/food/{entryId}:
 *   patch:
 *     tags: [Daily Logs]
 *     summary: Update the grams of a food entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dailyLogId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: entryId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [grams]
 *             properties:
 *               grams: { type: number, format: float, example: 200 }
 *     responses:
 *       200:
 *         description: Updated food entry
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FoodEntry' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.patch('/:dailyLogId/food/:entryId', auth, updateFoodEntry);

/**
 * @openapi
 * /api/daily-logs/{dailyLogId}/food/{entryId}:
 *   delete:
 *     tags: [Daily Logs]
 *     summary: Remove a food entry from a daily log
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dailyLogId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: entryId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:dailyLogId/food/:entryId', auth, removeFoodEntry);

module.exports = router;
