async function post(path, body) {
  const res = await fetch(`/api/auth${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  return data
}

export function login({ email, password }) {
  return post('/login', { email, password })
}

export function register({ username, email, password }) {
  return post('/register', { username, email, password })
}
