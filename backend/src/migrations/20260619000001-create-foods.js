'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Food', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      caloriesPer100g: {
        type: Sequelize.FLOAT,
      },
      proteinPer100g: {
        type: Sequelize.FLOAT,
      },
      carbsPer100g: {
        type: Sequelize.FLOAT,
      },
      fatPer100g: {
        type: Sequelize.FLOAT,
      },
      barcode: {
        type: Sequelize.STRING,
        unique: true,
      },
      source: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Food');
  },
};
