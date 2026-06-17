const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, JwtBlacklist } = require('../models');
const env = require('../config/env');

function signToken(userId) {
  return jwt.sign({ id: userId }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email and password are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: passwordHash });
    const token = signToken(user.id);

    return res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username or email already in use' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Invalid input' });
    }
    throw err;
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user.id);
  return res.status(200).json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
}

async function logout(req, res) {
  const token = req.headers.authorization.slice(7);
  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await JwtBlacklist.findOrCreate({ where: { token }, defaults: { token, expiresAt } });
  await JwtBlacklist.destroy({ where: { expiresAt: { [Op.lt]: new Date() } } });

  return res.status(200).json({ message: 'Logged out' });
}

module.exports = { register, login, logout };
