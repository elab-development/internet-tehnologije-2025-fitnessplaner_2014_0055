const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyLog = sequelize.define('DailyLog', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
  },
  protein: {
    type: DataTypes.INTEGER,
  },
  carbs: {
    type: DataTypes.INTEGER,
  },
  fat: {
    type: DataTypes.INTEGER,
  },
  hydration: {
    type: DataTypes.INTEGER,
  },
});

module.exports = DailyLog;
