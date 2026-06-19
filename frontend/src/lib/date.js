export function todayISO() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now - offset).toISOString().slice(0, 10)
}

export function formatLongDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  if (hour < 22) return 'Good evening'
  return 'Good night'
}
