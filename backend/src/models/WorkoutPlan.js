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
}, {
  indexes: [
    { unique: true, fields: ['userId', 'date'], name: 'workout_plans_user_date_unique' },
  ],
});

module.exports = WorkoutPlan;
