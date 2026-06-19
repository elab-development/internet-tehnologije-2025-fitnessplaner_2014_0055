import { apiGet } from './client'

export function getWorkoutPlans(date) {
  return apiGet(`/workout-plans?date=${date}`)
}
