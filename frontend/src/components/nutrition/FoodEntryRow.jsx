import { useState } from 'react'

function macrosFor(food, grams) {
  const factor = grams / 100
  return {
    calories: Math.round((food?.caloriesPer100g ?? 0) * factor),
    protein: Math.round((food?.proteinPer100g ?? 0) * factor),
    carbs: Math.round((food?.carbsPer100g ?? 0) * factor),
    fat: Math.round((food?.fatPer100g ?? 0) * factor),
  }
}

function FoodEntryRow({ entry, onUpdate, onRemove }) {
  const [grams, setGrams] = useState(String(entry.grams))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const macros = macrosFor(entry.Food, Number(grams) || 0)

  async function save() {
    const amount = Number(grams)
    if (!Number.isFinite(amount) || amount <= 0 || amount === entry.grams) return
    setBusy(true)
    setError('')
    try {
      await onUpdate(entry.id, amount)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    setBusy(true)
    setError('')
    try {
      await onRemove(entry.id)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <li className="entry-row">
      <div className="entry-main">
        <span className="food-name">{entry.Food?.name}</span>
        <span className="muted">
          {macros.calories} kcal · P {macros.protein} · C {macros.carbs} · F {macros.fat}
        </span>
      </div>
      <div className="entry-controls">
        <input
          type="number"
          min="1"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          aria-label="grams"
          disabled={busy}
        />
        <span className="muted">g</span>
        <button type="button" className="remove" onClick={remove} disabled={busy}>Remove</button>
      </div>
      {error && <p className="card-error">{error}</p>}
    </li>
  )
}

export default FoodEntryRow
