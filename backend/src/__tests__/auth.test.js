process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');

jest.mock('../models', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

const bcrypt = require('bcryptjs');
const { User } = require('../models');
const app = require('../app');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/auth/register', () => {
  test('creates a user and returns a token', async () => {
    User.create.mockResolvedValue({ id: 1, username: 'alice', email: 'alice@example.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'alice', email: 'alice@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toEqual({ id: 1, username: 'alice', email: 'alice@example.com' });
    expect(res.body.user.password).toBeUndefined();

    const storedPassword = User.create.mock.calls[0][0].password;
    expect(storedPassword).not.toBe('secret123');
  });

  test('returns 400 when a field is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@example.com', password: 'secret123' });

    expect(res.status).toBe(400);
    expect(User.create).not.toHaveBeenCalled();
  });

  test('returns 409 on duplicate username or email', async () => {
    User.create.mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'alice', email: 'alice@example.com', password: 'secret123' });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  test('returns a token for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('secret123', 10);
    User.findOne.mockResolvedValue({
      id: 1,
      username: 'alice',
      email: 'alice@example.com',
      password: passwordHash,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toEqual({ id: 1, username: 'alice', email: 'alice@example.com' });
  });

  test('returns 401 for a wrong password', async () => {
    const passwordHash = await bcrypt.hash('secret123', 10);
    User.findOne.mockResolvedValue({
      id: 1,
      username: 'alice',
      email: 'alice@example.com',
      password: passwordHash,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
  });

  test('returns 401 for an unknown email', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'secret123' });

    expect(res.status).toBe(401);
  });
});
