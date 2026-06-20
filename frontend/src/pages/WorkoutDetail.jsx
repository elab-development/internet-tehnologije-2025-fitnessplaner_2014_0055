import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getWorkoutPlan } from '../api/workoutPlans'
import { formatLongDate } from '../lib/date'
import TopNav from '../components/TopNav'
import './home.css'
import './workoutDetail.css'

function WorkoutDetail() {
  const { id } = useParams()
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getWorkoutPlan(id)
      .then((data) => { if (active) setPlan(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [id])

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

            {items.length === 0 && <p className="muted">No exercises in this workout.</p>}

            {items.length > 0 && (
              <ul className="exercise-list">
                {items.map((item) => (
                  <li key={item.id}>
                    <span className="exercise-name">{item.Exercise?.name}</span>
                    <span className="muted">{item.sets} × {item.reps}</span>
                  </li>
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
