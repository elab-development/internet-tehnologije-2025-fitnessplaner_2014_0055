const sequelize = require('../config/database');
const User = require('./User');
const Exercise = require('./Exercise');
const WorkoutPlan = require('./WorkoutPlan');
const WorkoutItem = require('./WorkoutItem');
const DailyLog = require('./DailyLog');

User.hasMany(WorkoutPlan, { foreignKey: 'userId' });
WorkoutPlan.belongsTo(User, { foreignKey: 'userId' });

WorkoutPlan.hasMany(WorkoutItem, { foreignKey: 'workoutPlanId' });
WorkoutItem.belongsTo(WorkoutPlan, { foreignKey: 'workoutPlanId' });

Exercise.hasMany(WorkoutItem, { foreignKey: 'exerciseId' });
WorkoutItem.belongsTo(Exercise, { foreignKey: 'exerciseId' });

User.hasMany(DailyLog, { foreignKey: 'userId' });
DailyLog.belongsTo(User, { foreignKey: 'userId' });

WorkoutPlan.hasOne(DailyLog, { foreignKey: 'workoutPlanId' });
DailyLog.belongsTo(WorkoutPlan, { foreignKey: 'workoutPlanId' });

module.exports = {
  sequelize,
  User,
  Exercise,
  WorkoutPlan,
  WorkoutItem,
  DailyLog,
};
