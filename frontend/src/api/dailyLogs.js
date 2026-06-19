import { apiGet } from './client'

export function getDailyLog(date) {
  return apiGet(`/daily-logs?date=${date}`)
}
