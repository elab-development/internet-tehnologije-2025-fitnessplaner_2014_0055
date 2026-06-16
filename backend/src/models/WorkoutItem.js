const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutItem = sequelize.define('WorkoutItem', {
  sets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = WorkoutItem;
