process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');

jest.mock('../models', () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  JwtBlacklist: {
    findOne: jest.fn(),
  },
}));

const jwt = require('jsonwebtoken');
const { User, JwtBlacklist } = require('../models');
const app = require('../app');

const tokenFor = (role) => jwt.sign({ id: 1, role }, 'test-secret', { expiresIn: '1d' });

beforeEach(() => {
  jest.clearAllMocks();
  JwtBlacklist.findOne.mockResolvedValue(null);
});

describe('GET /api/users', () => {
  test('returns the list of users for an admin', async () => {
    const users = [{ id: 1, username: 'alice', email: 'alice@example.com', role: 'admin' }];
    User.findAll.mockResolvedValue(users);

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${tokenFor('admin')}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(users);
  });

  test('returns 403 for a non-admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${tokenFor('user')}`);

    expect(res.status).toBe(403);
    expect(User.findAll).not.toHaveBeenCalled();
  });

  test('returns 401 without a token', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/users/:id/role', () => {
  test('updates the role for an admin', async () => {
    const user = {
      id: 2,
      username: 'bob',
      email: 'bob@example.com',
      role: 'user',
      update: jest.fn().mockImplementation(function ({ role }) {
        this.role = role;
        return Promise.resolve(this);
      }),
    };
    User.findByPk.mockResolvedValue(user);

    const res = await request(app)
      .patch('/api/users/2/role')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ role: 'trainer' });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('trainer');
    expect(user.update).toHaveBeenCalledWith({ role: 'trainer' });
  });

  test('returns 400 for an invalid role', async () => {
    const res = await request(app)
      .patch('/api/users/2/role')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ role: 'superuser' });

    expect(res.status).toBe(400);
    expect(User.findByPk).not.toHaveBeenCalled();
  });

  test('returns 403 for a non-admin', async () => {
    const res = await request(app)
      .patch('/api/users/2/role')
      .set('Authorization', `Bearer ${tokenFor('user')}`)
      .send({ role: 'trainer' });

    expect(res.status).toBe(403);
  });

  test('returns 403 when an admin changes their own role', async () => {
    const res = await request(app)
      .patch('/api/users/1/role')
      .set('Authorization', `Bearer ${tokenFor('admin')}`)
      .send({ role: 'user' });

    expect(res.status).toBe(403);
    expect(User.findByPk).not.toHaveBeenCalled();
  });
});
