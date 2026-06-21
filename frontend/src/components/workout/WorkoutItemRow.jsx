import { useState } from 'react'

function WorkoutItemRow({ item, onUpdate, onRemove }) {
  const [sets, setSets] = useState(String(item.sets))
  const [reps, setReps] = useState(String(item.reps))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    const nextSets = Number(sets)
    const nextReps = Number(reps)
    if (!Number.isInteger(nextSets) || nextSets <= 0) return
    if (!Number.isInteger(nextReps) || nextReps <= 0) return
    if (nextSets === item.sets && nextReps === item.reps) return
    setBusy(true)
    setError('')
    try {
      await onUpdate(item.id, nextSets, nextReps)
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
      await onRemove(item.id)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <li className="entry-row">
      <span className="exercise-name">{item.Exercise?.name}</span>
      <div className="entry-controls">
        <input
          type="number"
          min="1"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          aria-label="sets"
          disabled={busy}
        />
        <span className="muted">×</span>
        <input
          type="number"
          min="1"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          aria-label="reps"
          disabled={busy}
        />
        <button type="button" className="remove" onClick={remove} disabled={busy}>Remove</button>
      </div>
      {error && <p className="card-error">{error}</p>}
    </li>
  )
}

export default WorkoutItemRow
