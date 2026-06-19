const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Food = sequelize.define('Food', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  caloriesPer100g: {
    type: DataTypes.FLOAT,
  },
  proteinPer100g: {
    type: DataTypes.FLOAT,
  },
  carbsPer100g: {
    type: DataTypes.FLOAT,
  },
  fatPer100g: {
    type: DataTypes.FLOAT,
  },
  barcode: {
    type: DataTypes.STRING,
    unique: true,
  },
  source: {
    type: DataTypes.STRING,
  },
});

module.exports = Food;
