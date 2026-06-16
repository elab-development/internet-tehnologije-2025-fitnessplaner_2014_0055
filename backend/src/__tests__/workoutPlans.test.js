process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../models', () => ({
  sequelize: {
    transaction: jest.fn((cb) => cb('tx')),
  },
  WorkoutPlan: {
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  WorkoutItem: {
    bulkCreate: jest.fn(),
  },
  Exercise: {
    findAll: jest.fn(),
  },
}));

const { WorkoutPlan, WorkoutItem, Exercise } = require('../models');
const app = require('../app');

const token = jwt.sign({ id: 1 }, 'test-secret');
const auth = `Bearer ${token}`;

const validBody = {
  name: 'Push Day',
  date: '2026-06-17',
  items: [
    { exerciseId: 1, sets: 3, reps: 10 },
    { exerciseId: 2, sets: 4, reps: 8 },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  Exercise.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
  WorkoutPlan.create.mockResolvedValue({ id: 10 });
  WorkoutItem.bulkCreate.mockResolvedValue([]);
  WorkoutPlan.findByPk.mockResolvedValue({ id: 10, userId: 1, date: '2026-06-17', WorkoutItems: [] });
});

describe('POST /api/workout-plans', () => {
  test('creates a plan with items and returns 201', async () => {
    const res = await request(app).post('/api/workout-plans').set('Authorization', auth).send(validBody);

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(10);
    expect(WorkoutItem.bulkCreate).toHaveBeenCalledTimes(1);
    const createdItems = WorkoutItem.bulkCreate.mock.calls[0][0];
    expect(createdItems).toHaveLength(2);
    expect(createdItems[0]).toMatchObject({ workoutPlanId: 10, exerciseId: 1, sets: 3, reps: 10 });
  });

  test('derives userId from the token, ignoring any userId in the body', async () => {
    await request(app)
      .post('/api/workout-plans')
      .set('Authorization', auth)
      .send({ ...validBody, userId: 999 });

    expect(WorkoutPlan.create.mock.calls[0][0].userId).toBe(1);
  });

  test('returns 401 without a token', async () => {
    const res = await request(app).post('/api/workout-plans').send(validBody);

    expect(res.status).toBe(401);
    expect(WorkoutPlan.create).not.toHaveBeenCalled();
  });

  test('returns 401 with an invalid token', async () => {
    const res = await request(app)
      .post('/api/workout-plans')
      .set('Authorization', 'Bearer not-a-real-token')
      .send(validBody);

    expect(res.status).toBe(401);
  });

  test('returns 400 when date is missing', async () => {
    const { date, ...body } = validBody;
    const res = await request(app).post('/api/workout-plans').set('Authorization', auth).send(body);

    expect(res.status).toBe(400);
    expect(WorkoutPlan.create).not.toHaveBeenCalled();
  });

  test('returns 400 when items is empty', async () => {
    const res = await request(app)
      .post('/api/workout-plans')
      .set('Authorization', auth)
      .send({ ...validBody, items: [] });

    expect(res.status).toBe(400);
    expect(WorkoutPlan.create).not.toHaveBeenCalled();
  });

  test('returns 400 when an item has non-positive sets', async () => {
    const res = await request(app)
      .post('/api/workout-plans')
      .set('Authorization', auth)
      .send({ ...validBody, items: [{ exerciseId: 1, sets: 0, reps: 10 }] });

    expect(res.status).toBe(400);
    expect(WorkoutPlan.create).not.toHaveBeenCalled();
  });

  test('returns 400 when an item is missing exerciseId', async () => {
    const res = await request(app)
      .post('/api/workout-plans')
      .set('Authorization', auth)
      .send({ ...validBody, items: [{ sets: 3, reps: 10 }] });

    expect(res.status).toBe(400);
    expect(WorkoutPlan.create).not.toHaveBeenCalled();
  });

  test('returns 400 when an exerciseId does not exist', async () => {
    Exercise.findAll.mockResolvedValue([{ id: 1 }]);

    const res = await request(app).post('/api/workout-plans').set('Authorization', auth).send(validBody);

    expect(res.status).toBe(400);
    expect(WorkoutPlan.create).not.toHaveBeenCalled();
  });
});
