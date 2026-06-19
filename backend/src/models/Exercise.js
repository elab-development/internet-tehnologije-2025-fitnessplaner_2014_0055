const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exercise = sequelize.define('Exercise', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  muscles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  description: {
    type: DataTypes.TEXT,
  },
  videoURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Exercise;
