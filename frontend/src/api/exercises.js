import { apiGet, apiPost, apiPut, apiDelete } from './client'

export function getExercises() {
  return apiGet('/exercises')
}

export function getExercise(id) {
  return apiGet(`/exercises/${id}`)
}

export function createExercise(data) {
  return apiPost('/exercises', data)
}

export function updateExercise(id, data) {
  return apiPut(`/exercises/${id}`, data)
}

export function deleteExercise(id) {
  return apiDelete(`/exercises/${id}`)
}
