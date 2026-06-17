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
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  WorkoutItem: {
    bulkCreate: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Exercise: {
    findAll: jest.fn(),
  },
  JwtBlacklist: {
    findOne: jest.fn(),
  },
}));

const { WorkoutPlan, WorkoutItem, Exercise, JwtBlacklist } = require('../models');
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
  JwtBlacklist.findOne.mockResolvedValue(null);
  Exercise.findAll.mockImplementation(({ where }) => Promise.resolve(where.id.map((id) => ({ id }))));
  WorkoutPlan.create.mockResolvedValue({ id: 10 });
  WorkoutItem.bulkCreate.mockResolvedValue([]);
  WorkoutPlan.findByPk.mockResolvedValue({ id: 10, userId: 1, date: '2026-06-17', WorkoutItems: [] });
  WorkoutPlan.findOne.mockResolvedValue({
    id: 10,
    userId: 1,
    WorkoutItems: [{ id: 100, exerciseId: 1, sets: 3, reps: 10 }],
  });
  WorkoutPlan.update.mockResolvedValue([1]);
  WorkoutItem.update.mockResolvedValue([1]);
  WorkoutItem.destroy.mockResolvedValue(1);
  WorkoutPlan.destroy.mockResolvedValue(1);
  WorkoutPlan.findAll.mockResolvedValue([
    { id: 10, userId: 1, date: '2026-06-17', WorkoutItems: [{ id: 100, exerciseId: 1, sets: 3, reps: 10 }] },
  ]);
});

describe('GET /api/workout-plans', () => {
  test('returns 200 with the plans for a valid date', async () => {
    const res = await request(app).get('/api/workout-plans?date=2026-06-17').set('Authorization', auth);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(10);
    expect(WorkoutPlan.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { date: '2026-06-17', userId: 1 } }),
    );
  });

  test('returns 200 with an empty array when no plans match', async () => {
    WorkoutPlan.findAll.mockResolvedValue([]);

    const res = await request(app).get('/api/workout-plans?date=2026-06-17').set('Authorization', auth);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns 400 when date is missing', async () => {
    const res = await request(app).get('/api/workout-plans').set('Authorization', auth);

    expect(res.status).toBe(400);
    expect(WorkoutPlan.findAll).not.toHaveBeenCalled();
  });

  test('returns 400 for an invalid date format', async () => {
    const res = await request(app).get('/api/workout-plans?date=06-17-2026').set('Authorization', auth);

    expect(res.status).toBe(400);
    expect(WorkoutPlan.findAll).not.toHaveBeenCalled();
  });

  test('returns 401 without a token', async () => {
    const res = await request(app).get('/api/workout-plans?date=2026-06-17');

    expect(res.status).toBe(401);
    expect(WorkoutPlan.findAll).not.toHaveBeenCalled();
  });
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

  test('creates a plan with no items and returns 201', async () => {
    const res = await request(app)
      .post('/api/workout-plans')
      .set('Authorization', auth)
      .send({ ...validBody, items: [] });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(10);
    expect(WorkoutPlan.create).toHaveBeenCalledTimes(1);
    expect(WorkoutItem.bulkCreate).not.toHaveBeenCalled();
  });

  test('creates a plan when items is omitted and returns 201', async () => {
    const { items, ...body } = validBody;
    const res = await request(app).post('/api/workout-plans').set('Authorization', auth).send(body);

    expect(res.status).toBe(201);
    expect(WorkoutPlan.create).toHaveBeenCalledTimes(1);
    expect(WorkoutItem.bulkCreate).not.toHaveBeenCalled();
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

describe('PUT /api/workout-plans/:id', () => {
  test('updates an existing item in place and returns 200', async () => {
    const res = await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({ name: 'Push Day', date: '2026-06-18', items: [{ id: 100, exerciseId: 1, sets: 5, reps: 5 }] });

    expect(res.status).toBe(200);
    expect(WorkoutItem.update).toHaveBeenCalledWith(
      { exerciseId: 1, sets: 5, reps: 5 },
      expect.objectContaining({ where: { id: 100 } }),
    );
    expect(WorkoutItem.bulkCreate).not.toHaveBeenCalled();
    expect(WorkoutItem.destroy).not.toHaveBeenCalled();
  });

  test('adds a new item via bulkCreate', async () => {
    await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({
        date: '2026-06-18',
        items: [
          { id: 100, exerciseId: 1, sets: 3, reps: 10 },
          { exerciseId: 2, sets: 4, reps: 8 },
        ],
      });

    const created = WorkoutItem.bulkCreate.mock.calls[0][0];
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({ workoutPlanId: 10, exerciseId: 2, sets: 4, reps: 8 });
    expect(WorkoutItem.destroy).not.toHaveBeenCalled();
  });

  test('removes an item omitted from the payload', async () => {
    await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({ date: '2026-06-18', items: [{ exerciseId: 2, sets: 4, reps: 8 }] });

    expect(WorkoutItem.destroy).toHaveBeenCalledWith(expect.objectContaining({ where: { id: [100] } }));
    expect(WorkoutItem.bulkCreate).toHaveBeenCalledTimes(1);
  });

  test('handles mixed create, update and delete in one request', async () => {
    WorkoutPlan.findOne.mockResolvedValue({
      id: 10,
      userId: 1,
      WorkoutItems: [
        { id: 100, exerciseId: 1, sets: 3, reps: 10 },
        { id: 101, exerciseId: 2, sets: 4, reps: 8 },
      ],
    });

    await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({
        date: '2026-06-18',
        items: [
          { id: 100, exerciseId: 1, sets: 5, reps: 5 },
          { exerciseId: 2, sets: 4, reps: 8 },
        ],
      });

    expect(WorkoutItem.update).toHaveBeenCalledWith(
      { exerciseId: 1, sets: 5, reps: 5 },
      expect.objectContaining({ where: { id: 100 } }),
    );
    expect(WorkoutItem.destroy).toHaveBeenCalledWith(expect.objectContaining({ where: { id: [101] } }));
    expect(WorkoutItem.bulkCreate.mock.calls[0][0]).toHaveLength(1);
  });

  test('clears all items when items is empty', async () => {
    const res = await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({ date: '2026-06-18', items: [] });

    expect(res.status).toBe(200);
    expect(WorkoutItem.destroy).toHaveBeenCalledWith(expect.objectContaining({ where: { id: [100] } }));
    expect(WorkoutItem.bulkCreate).not.toHaveBeenCalled();
    expect(WorkoutItem.update).not.toHaveBeenCalled();
  });

  test('returns 404 when the plan does not exist or is owned by another user', async () => {
    WorkoutPlan.findOne.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({ date: '2026-06-18', items: [{ exerciseId: 1, sets: 3, reps: 10 }] });

    expect(res.status).toBe(404);
    expect(WorkoutPlan.update).not.toHaveBeenCalled();
  });

  test('returns 400 for a non-numeric id', async () => {
    const res = await request(app)
      .put('/api/workout-plans/abc')
      .set('Authorization', auth)
      .send({ date: '2026-06-18', items: [] });

    expect(res.status).toBe(400);
    expect(WorkoutPlan.findOne).not.toHaveBeenCalled();
  });

  test('returns 400 when date is missing', async () => {
    const res = await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({ items: [{ exerciseId: 1, sets: 3, reps: 10 }] });

    expect(res.status).toBe(400);
    expect(WorkoutPlan.update).not.toHaveBeenCalled();
  });

  test('returns 400 when an item has non-positive reps', async () => {
    const res = await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({ date: '2026-06-18', items: [{ exerciseId: 1, sets: 3, reps: 0 }] });

    expect(res.status).toBe(400);
    expect(WorkoutPlan.update).not.toHaveBeenCalled();
  });

  test('returns 400 when an exerciseId does not exist', async () => {
    Exercise.findAll.mockResolvedValue([]);

    const res = await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({ date: '2026-06-18', items: [{ exerciseId: 99, sets: 3, reps: 10 }] });

    expect(res.status).toBe(400);
    expect(WorkoutPlan.update).not.toHaveBeenCalled();
  });

  test('returns 400 when an item id does not belong to the plan', async () => {
    const res = await request(app)
      .put('/api/workout-plans/10')
      .set('Authorization', auth)
      .send({ date: '2026-06-18', items: [{ id: 999, exerciseId: 1, sets: 3, reps: 10 }] });

    expect(res.status).toBe(400);
    expect(WorkoutPlan.update).not.toHaveBeenCalled();
  });

  test('returns 401 without a token', async () => {
    const res = await request(app)
      .put('/api/workout-plans/10')
      .send({ date: '2026-06-18', items: [] });

    expect(res.status).toBe(401);
    expect(WorkoutPlan.update).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/workout-plans/:id', () => {
  test('deletes a plan owned by the user and returns 204', async () => {
    const res = await request(app).delete('/api/workout-plans/10').set('Authorization', auth);

    expect(res.status).toBe(204);
    expect(WorkoutPlan.destroy).toHaveBeenCalledWith({ where: { id: 10, userId: 1 } });
  });

  test('returns 404 when the plan does not exist or is owned by another user', async () => {
    WorkoutPlan.destroy.mockResolvedValue(0);

    const res = await request(app).delete('/api/workout-plans/10').set('Authorization', auth);

    expect(res.status).toBe(404);
  });

  test('returns 400 for a non-numeric id', async () => {
    const res = await request(app).delete('/api/workout-plans/abc').set('Authorization', auth);

    expect(res.status).toBe(400);
    expect(WorkoutPlan.destroy).not.toHaveBeenCalled();
  });

  test('returns 401 without a token', async () => {
    const res = await request(app).delete('/api/workout-plans/10');

    expect(res.status).toBe(401);
    expect(WorkoutPlan.destroy).not.toHaveBeenCalled();
  });
});
