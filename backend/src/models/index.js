const sequelize = require('../config/database');
const User = require('./User');
const Exercise = require('./Exercise');
const WorkoutPlan = require('./WorkoutPlan');
const WorkoutItem = require('./WorkoutItem');
const DailyLog = require('./DailyLog');
const Food = require('./Food');
const FoodEntry = require('./FoodEntry');
const JwtBlacklist = require('./JwtBlacklist');

User.hasMany(WorkoutPlan, { foreignKey: 'userId' });
WorkoutPlan.belongsTo(User, { foreignKey: 'userId' });

WorkoutPlan.hasMany(WorkoutItem, { foreignKey: 'workoutPlanId' });
WorkoutItem.belongsTo(WorkoutPlan, { foreignKey: 'workoutPlanId' });

Exercise.hasMany(WorkoutItem, { foreignKey: 'exerciseId' });
WorkoutItem.belongsTo(Exercise, { foreignKey: 'exerciseId' });

User.hasMany(DailyLog, { foreignKey: 'userId' });
DailyLog.belongsTo(User, { foreignKey: 'userId' });

DailyLog.hasMany(FoodEntry, { foreignKey: 'dailyLogId' });
FoodEntry.belongsTo(DailyLog, { foreignKey: 'dailyLogId' });

Food.hasMany(FoodEntry, { foreignKey: 'foodId' });
FoodEntry.belongsTo(Food, { foreignKey: 'foodId' });

module.exports = {
  sequelize,
  User,
  Exercise,
  WorkoutPlan,
  WorkoutItem,
  DailyLog,
  Food,
  FoodEntry,
  JwtBlacklist,
};
