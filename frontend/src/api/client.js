import { getToken, clearAuth } from '../lib/auth'

export async function apiGet(path) {
  const res = await fetch(`/api${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })

  if (res.status === 401) {
    clearAuth()
    window.location.href = '/login'
    return
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  return data
}
