import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExercises, createExercise, updateExercise, deleteExercise } from '../api/exercises'
import { clearAuth } from '../lib/auth'
import { logout } from '../api/auth'
import './admin.css'
import './manageExercises.css'

const EMPTY_FORM = { name: '', muscles: '', description: '', videoId: '' }

function TrainerExercises() {
  const navigate = useNavigate()
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getExercises()
      .then(setExercises)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function startCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  function startEdit(exercise) {
    setEditingId(exercise.id)
    setForm({
      name: exercise.name,
      muscles: exercise.muscles || '',
      description: exercise.description || '',
      videoId: exercise.videoId || '',
    })
    setFormError('')
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!form.name.trim()) {
      setFormError('Name is required')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        const updated = await updateExercise(editingId, form)
        setExercises((list) => list.map((ex) => (ex.id === editingId ? updated : ex)))
      } else {
        const created = await createExercise(form)
        setExercises((list) => [...list, created])
      }
      startCreate()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(exercise) {
    if (!window.confirm(`Delete "${exercise.name}"?`)) return
    try {
      await deleteExercise(exercise.id)
      setExercises((list) => list.filter((ex) => ex.id !== exercise.id))
      if (editingId === exercise.id) startCreate()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleLogout() {
    try {
      await logout()
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <div className="admin">
      <header className="admin-bar">
        <span className="brand">Fitness Planner</span>
        <button type="button" className="logout" onClick={handleLogout}>Log out</button>
      </header>

      <main className="admin-main">
        <h1>Exercises</h1>

        <form className="exercise-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit exercise' : 'Add exercise'}</h2>

          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} />
          </label>

          <label>
            Muscles
            <input name="muscles" value={form.muscles} onChange={handleChange} />
          </label>

          <label>
            Description
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} />
          </label>

          <label>
            YouTube video ID
            <input name="videoId" value={form.videoId} onChange={handleChange} />
          </label>

          {formError && <p className="form-error">{formError}</p>}

          <div className="exercise-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add exercise'}
            </button>
            {editingId && (
              <button type="button" className="secondary" onClick={startCreate} disabled={saving}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {loading && <p className="muted">Loading…</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && (
          <ul className="exercise-list">
            {exercises.map((exercise) => (
              <li key={exercise.id} className="exercise-list-item">
                <div>
                  <span className="exercise-name">{exercise.name}</span>
                  {exercise.muscles && <span className="muted"> · {exercise.muscles}</span>}
                </div>
                <div className="exercise-list-actions">
                  <button type="button" onClick={() => startEdit(exercise)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(exercise)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default TrainerExercises
