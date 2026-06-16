'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DailyLogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      calories: {
        type: Sequelize.INTEGER,
      },
      protein: {
        type: Sequelize.INTEGER,
      },
      carbs: {
        type: Sequelize.INTEGER,
      },
      fat: {
        type: Sequelize.INTEGER,
      },
      hydration: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      workoutPlanId: {
        type: Sequelize.INTEGER,
        references: { model: 'WorkoutPlans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('DailyLogs');
  },
};
