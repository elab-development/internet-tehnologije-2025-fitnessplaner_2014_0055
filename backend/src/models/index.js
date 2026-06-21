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

async function recalculateDailyLogTotals(dailyLogId) {
  const entries = await FoodEntry.findAll({ where: { dailyLogId }, include: [Food] });
  const totals = entries.reduce((acc, entry) => {
    const factor = entry.grams / 100;
    acc.calories += (entry.Food.caloriesPer100g ?? 0) * factor;
    acc.protein += (entry.Food.proteinPer100g ?? 0) * factor;
    acc.carbs += (entry.Food.carbsPer100g ?? 0) * factor;
    acc.fat += (entry.Food.fatPer100g ?? 0) * factor;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  await DailyLog.update({
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
  }, { where: { id: dailyLogId } });
}

FoodEntry.addHook('afterCreate', (entry) => recalculateDailyLogTotals(entry.dailyLogId));
FoodEntry.addHook('afterUpdate', (entry) => recalculateDailyLogTotals(entry.dailyLogId));
FoodEntry.addHook('afterDestroy', (entry) => recalculateDailyLogTotals(entry.dailyLogId));

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
