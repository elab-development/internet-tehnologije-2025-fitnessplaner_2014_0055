import { apiGet, apiPatch } from './client'

export function getUsers() {
  return apiGet('/users')
}

export function updateUserRole(id, role) {
  return apiPatch(`/users/${id}/role`, { role })
}
