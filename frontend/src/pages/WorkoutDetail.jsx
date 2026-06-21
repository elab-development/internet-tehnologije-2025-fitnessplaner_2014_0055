import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getWorkoutPlan,
  addWorkoutItem,
  updateWorkoutItem,
  removeWorkoutItem,
} from '../api/workoutPlans'
import { getExercises } from '../api/exercises'
import { formatLongDate } from '../lib/date'
import TopNav from '../components/TopNav'
import ExercisePicker from '../components/workout/ExercisePicker'
import WorkoutItemRow from '../components/workout/WorkoutItemRow'
import './home.css'
import './workoutDetail.css'

function WorkoutDetail() {
  const { id } = useParams()
  const [plan, setPlan] = useState(null)
  const [exercises, setExercises] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getWorkoutPlan(id), getExercises()])
      .then(([planData, exerciseData]) => {
        if (!active) return
        setPlan(planData)
        setExercises(exerciseData)
      })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [id])

  async function refresh() {
    setPlan(await getWorkoutPlan(id))
  }

  async function handleAdd(exerciseId, sets, reps) {
    await addWorkoutItem(id, exerciseId, sets, reps)
    await refresh()
  }

  async function handleUpdate(itemId, sets, reps) {
    await updateWorkoutItem(id, itemId, sets, reps)
    await refresh()
  }

  async function handleRemove(itemId) {
    await removeWorkoutItem(id, itemId)
    await refresh()
  }

  const items = plan?.WorkoutItems ?? []

  return (
    <div className="home">
      <TopNav />
      <main className="home-main">
        <Link to="/" className="back-link">← Back</Link>

        {error && <p className="card-error">{error}</p>}
        {!error && plan === null && <p className="muted">Loading…</p>}

        {!error && plan && (
          <>
            <header className="home-header">
              <h1>{plan.name || 'Workout'}</h1>
              <p className="muted">{formatLongDate(plan.date)}</p>
            </header>

            <ExercisePicker exercises={exercises} onAdd={handleAdd} />

            {items.length === 0 && <p className="muted">No exercises yet. Add one above.</p>}

            {items.length > 0 && (
              <ul className="entry-list">
                {items.map((item) => (
                  <WorkoutItemRow
                    key={item.id}
                    item={item}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default WorkoutDetail
