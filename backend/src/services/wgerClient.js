const WGER_BASE_URL = 'https://wger.de/api/v2';
const ENGLISH_LANGUAGE_ID = 2;
const REQUEST_TIMEOUT_MS = 5000;

async function fetchJson(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'FitnessPlaner/1.0' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

async function getEnrichmentByName(name) {
  const translationUrl = `${WGER_BASE_URL}/exercise-translation/?format=json`
    + `&language=${ENGLISH_LANGUAGE_ID}`
    + `&name=${encodeURIComponent(name)}&limit=1`;

  const translations = await fetchJson(translationUrl);
  const exerciseId = translations?.results?.[0]?.exercise;
  if (!exerciseId) {
    return null;
  }

  const info = await fetchJson(`${WGER_BASE_URL}/exerciseinfo/${exerciseId}/?format=json`);
  if (!info) {
    return null;
  }

  return {
    category: info.category?.name ?? null,
    equipment: (info.equipment || []).map((item) => item.name),
    musclesSecondary: (info.muscles_secondary || []).map((muscle) => muscle.name_en || muscle.name),
  };
}

module.exports = { getEnrichmentByName };
