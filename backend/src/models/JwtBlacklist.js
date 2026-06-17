const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JwtBlacklist = sequelize.define('JwtBlacklist', {
  token: {
    type: DataTypes.STRING(512),
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = JwtBlacklist;
