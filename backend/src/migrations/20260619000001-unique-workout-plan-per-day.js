'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('WorkoutPlans', {
      fields: ['userId', 'date'],
      type: 'unique',
      name: 'workout_plans_user_date_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.addIndex('WorkoutPlans', ['userId'], {
      name: 'workout_plans_user_id',
    });
    await queryInterface.removeConstraint('WorkoutPlans', 'workout_plans_user_date_unique');
  },
};
