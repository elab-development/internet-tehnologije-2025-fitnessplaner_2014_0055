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
});

module.exports = Exercise;
