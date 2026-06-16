'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeConstraint('WorkoutItems', 'workoutitems_ibfk_1');
    await queryInterface.addConstraint('WorkoutItems', {
      fields: ['workoutPlanId'],
      type: 'foreign key',
      name: 'WorkoutItems_workoutPlanId_fkey',
      references: { table: 'WorkoutPlans', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('WorkoutItems', 'WorkoutItems_workoutPlanId_fkey');
    await queryInterface.addConstraint('WorkoutItems', {
      fields: ['workoutPlanId'],
      type: 'foreign key',
      name: 'workoutitems_ibfk_1',
      references: { table: 'WorkoutPlans', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};
