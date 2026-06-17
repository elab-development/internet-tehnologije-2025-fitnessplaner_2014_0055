'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeConstraint('DailyLogs', 'dailylogs_ibfk_2');
    await queryInterface.removeColumn('DailyLogs', 'workoutPlanId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('DailyLogs', 'workoutPlanId', {
      type: Sequelize.INTEGER,
      references: { model: 'WorkoutPlans', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};
