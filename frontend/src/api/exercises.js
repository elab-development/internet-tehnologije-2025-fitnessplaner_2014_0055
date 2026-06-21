import { apiGet } from './client'

export function getExercises() {
  return apiGet('/exercises')
}
