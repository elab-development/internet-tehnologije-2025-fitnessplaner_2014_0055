import { apiGet, apiPost, apiPatch, apiDelete } from './client'

export function getDailyLog(date) {
  return apiGet(`/daily-logs?date=${date}`)
}

export function createDailyLog(date) {
  return apiPost('/daily-logs', { date })
}

export function updateHydration(dailyLogId, hydration) {
  return apiPatch(`/daily-logs/${dailyLogId}`, { hydration })
}

export function addFoodEntry(dailyLogId, foodId, grams) {
  return apiPost(`/daily-logs/${dailyLogId}/food`, { foodId, grams })
}

export function updateFoodEntry(dailyLogId, entryId, grams) {
  return apiPatch(`/daily-logs/${dailyLogId}/food/${entryId}`, { grams })
}

export function removeFoodEntry(dailyLogId, entryId) {
  return apiDelete(`/daily-logs/${dailyLogId}/food/${entryId}`)
}
