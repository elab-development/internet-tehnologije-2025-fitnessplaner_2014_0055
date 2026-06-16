const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutPlan = sequelize.define('WorkoutPlan', {
  name: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = WorkoutPlan;
