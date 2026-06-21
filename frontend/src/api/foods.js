import { apiGet } from './client'

export function searchFoods(q) {
  return apiGet(`/foods?q=${encodeURIComponent(q)}`)
}
