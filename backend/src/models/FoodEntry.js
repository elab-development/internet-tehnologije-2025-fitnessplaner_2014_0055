const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FoodEntry = sequelize.define('FoodEntry', {
  grams: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = FoodEntry;
