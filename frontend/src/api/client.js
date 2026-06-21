import { getToken, clearAuth } from '../lib/auth'

async function request(method, path, body) {
  const hasBody = body !== undefined

  const headers = { Authorization: `Bearer ${getToken()}` }
  if (hasBody) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: hasBody ? JSON.stringify(body) : undefined,
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

export function apiGet(path) {
  return request('GET', path)
}

export function apiPost(path, body) {
  return request('POST', path, body)
}

export function apiPatch(path, body) {
  return request('PATCH', path, body)
}

export function apiDelete(path) {
  return request('DELETE', path)
}
