import { apiGet } from './client'

export function getExercises() {
  return apiGet('/exercises')
}

export function getExercise(id) {
  return apiGet(`/exercises/${id}`)
}
