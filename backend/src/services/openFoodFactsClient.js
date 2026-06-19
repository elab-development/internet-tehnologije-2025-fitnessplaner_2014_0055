const OFF_SEARCH_URL = 'https://world.openfoodfacts.org/api/v2/search';
const PAGE_SIZE = 50;
const MAX_RESULTS = 20;
const REQUEST_TIMEOUT_MS = 5000;

function mapProduct(product) {
  const nutriments = product.nutriments || {};
  return {
    name: product.product_name,
    caloriesPer100g: nutriments['energy-kcal_100g'],
    proteinPer100g: nutriments.proteins_100g,
    carbsPer100g: nutriments.carbohydrates_100g,
    fatPer100g: nutriments.fat_100g,
    barcode: product.code || null,
    source: 'openfoodfacts',
  };
}

function isComplete(food) {
  return Boolean(food.name) && food.caloriesPer100g !== undefined && food.caloriesPer100g !== null;
}

async function searchByPrefix(query) {
  const url = `${OFF_SEARCH_URL}?search_terms=${encodeURIComponent(query)}`
    + '&fields=product_name,code,nutriments'
    + `&page_size=${PAGE_SIZE}`;

  let data;
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'FitnessPlaner/1.0' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      return [];
    }
    data = await response.json();
  } catch {
    return [];
  }

  const prefix = query.toLowerCase();
  return (data.products || [])
    .map(mapProduct)
    .filter(isComplete)
    .filter((food) => food.name.toLowerCase().startsWith(prefix))
    .slice(0, MAX_RESULTS);
}

module.exports = { searchByPrefix };
