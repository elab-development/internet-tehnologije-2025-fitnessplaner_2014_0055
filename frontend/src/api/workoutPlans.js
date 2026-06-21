import { apiGet, apiPost, apiPatch, apiDelete } from './client'

export function getWorkoutPlans(date) {
  return apiGet(`/workout-plans?date=${date}`)
}

export function getWorkoutPlan(id) {
  return apiGet(`/workout-plans/${id}`)
}

export function createWorkoutPlan(date) {
  return apiPost('/workout-plans', { date })
}

export function addWorkoutItem(planId, exerciseId, sets, reps) {
  return apiPost(`/workout-plans/${planId}/exercise`, { exerciseId, sets, reps })
}

export function updateWorkoutItem(planId, itemId, sets, reps) {
  return apiPatch(`/workout-plans/${planId}/exercise/${itemId}`, { sets, reps })
}

export function removeWorkoutItem(planId, itemId) {
  return apiDelete(`/workout-plans/${planId}/exercise/${itemId}`)
}
