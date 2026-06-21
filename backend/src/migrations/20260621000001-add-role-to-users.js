'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('user', 'trainer', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'role');
  },
};
