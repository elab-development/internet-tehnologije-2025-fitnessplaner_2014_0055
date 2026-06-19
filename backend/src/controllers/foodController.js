const { Op } = require('sequelize');
const { Food } = require('../models');
const openFoodFacts = require('../services/openFoodFactsClient');

const MIN_QUERY_LENGTH = 3;

async function searchFoods(req, res) {
  const q = (req.query.q || '').trim();

  if (q.length < MIN_QUERY_LENGTH) {
    return res.status(400).json({ message: 'q query param of at least 3 characters is required' });
  }

  const where = { name: { [Op.like]: `${q}%` } };

  const existing = await Food.findAll({ where });
  if (existing.length > 0) {
    return res.status(200).json(existing);
  }

  const offFoods = await openFoodFacts.searchByPrefix(q);
  if (offFoods.length > 0) {
    await Food.bulkCreate(offFoods, { ignoreDuplicates: true });
  }

  const foods = await Food.findAll({ where });
  return res.status(200).json(foods);
}

module.exports = { searchFoods };
