import { useState } from 'react'

function ExercisePicker({ exercises, onAdd }) {
  const [exerciseId, setExerciseId] = useState('')
  const [sets, setSets] = useState('3')
  const [reps, setReps] = useState('10')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    const id = Number(exerciseId)
    const nextSets = Number(sets)
    const nextReps = Number(reps)
    if (!id) return
    if (!Number.isInteger(nextSets) || nextSets <= 0) return
    if (!Number.isInteger(nextReps) || nextReps <= 0) return
    setBusy(true)
    setError('')
    try {
      await onAdd(id, nextSets, nextReps)
      setExerciseId('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <select
        value={exerciseId}
        onChange={(e) => setExerciseId(e.target.value)}
        aria-label="exercise"
        disabled={busy}
      >
        <option value="" disabled>Add an exercise…</option>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
        aria-label="sets"
        disabled={busy}
      />
      <span className="muted">×</span>
      <input
        type="number"
        min="1"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        aria-label="reps"
        disabled={busy}
      />
      <button type="submit" disabled={busy || !exerciseId}>Add</button>
      {error && <p className="card-error">{error}</p>}
    </form>
  )
}

export default ExercisePicker
