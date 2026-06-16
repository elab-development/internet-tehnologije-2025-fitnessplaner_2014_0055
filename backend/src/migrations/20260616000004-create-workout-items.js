'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WorkoutItems', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sets: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reps: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      workoutPlanId: {
        type: Sequelize.INTEGER,
        references: { model: 'WorkoutPlans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      exerciseId: {
        type: Sequelize.INTEGER,
        references: { model: 'Exercises', key: 'id' },
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
    await queryInterface.dropTable('WorkoutItems');
  },
};
