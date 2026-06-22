const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const { port } = require('./env');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Fitness Planner API',
      version: '1.0.0',
      description: 'REST API for the Fitness Planner application.',
    },
    servers: [{ url: `http://localhost:${port}`, description: 'Local server' }],
    tags: [
      { name: 'Auth', description: 'Registration, login and logout' },
      { name: 'Workout Plans', description: 'Daily workout plans and their exercises' },
      { name: 'Exercises', description: 'Exercise catalogue' },
      { name: 'Daily Logs', description: 'Nutrition logs and food entries' },
      { name: 'Foods', description: 'Food search' },
      { name: 'Users', description: 'User administration' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'janedoe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            role: { type: 'string', enum: ['user', 'trainer', 'admin'], example: 'user' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT bearer token' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Exercise: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Bench Press' },
            muscles: { type: 'string', example: 'chest, triceps' },
            description: { type: 'string', nullable: true },
            videoId: { type: 'string', nullable: true, example: 'rT7DgCr-3pg' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        WorkoutItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            workoutPlanId: { type: 'integer', example: 1 },
            exerciseId: { type: 'integer', example: 1 },
            sets: { type: 'integer', example: 3 },
            reps: { type: 'integer', example: 10 },
            Exercise: { $ref: '#/components/schemas/Exercise' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        WorkoutPlan: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', nullable: true, example: 'Push Day' },
            date: { type: 'string', format: 'date', example: '2026-06-22' },
            userId: { type: 'integer', example: 1 },
            WorkoutItems: {
              type: 'array',
              items: { $ref: '#/components/schemas/WorkoutItem' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Food: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Banana' },
            caloriesPer100g: { type: 'number', format: 'float', example: 89 },
            proteinPer100g: { type: 'number', format: 'float', example: 1.1 },
            carbsPer100g: { type: 'number', format: 'float', example: 23 },
            fatPer100g: { type: 'number', format: 'float', example: 0.3 },
            barcode: { type: 'string', nullable: true },
            source: { type: 'string', nullable: true, example: 'openfoodfacts' },
          },
        },
        FoodEntry: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            dailyLogId: { type: 'integer', example: 1 },
            foodId: { type: 'integer', example: 1 },
            grams: { type: 'number', format: 'float', example: 150 },
            Food: { $ref: '#/components/schemas/Food' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        DailyLog: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            date: { type: 'string', format: 'date', example: '2026-06-22' },
            calories: { type: 'integer', nullable: true, example: 1800 },
            protein: { type: 'integer', nullable: true, example: 120 },
            carbs: { type: 'integer', nullable: true, example: 200 },
            fat: { type: 'integer', nullable: true, example: 60 },
            hydration: { type: 'integer', nullable: true, example: 2000 },
            userId: { type: 'integer', example: 1 },
            FoodEntries: {
              type: 'array',
              items: { $ref: '#/components/schemas/FoodEntry' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Missing, malformed, revoked or expired token',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
        BadRequest: {
          description: 'Invalid input',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '..', 'routes', '*.js').replace(/\\/g, '/')],
};

module.exports = swaggerJsdoc(options);
