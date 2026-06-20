import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWorkoutPlans } from '../../api/workoutPlans'
import Card from '../Card'

function WorkoutSummary({ date }) {
  const [plan, setPlan] = useState(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getWorkoutPlans(date)
      .then((data) => { if (active) setPlan(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [date])

  const action = plan
    ? <Link to={`/workouts/${plan.id}`}>View</Link>
    : null

  return (
    <Card title="Today's workout" action={action}>
      {error && <p className="card-error">{error}</p>}
      {!error && plan === undefined && <p className="muted">Loading…</p>}
      {!error && plan === null && (
        <p className="muted">
          No workout planned for today. <Link to="/workouts">Plan one →</Link>
        </p>
      )}
      {!error && plan && (
        <ul className="plan-list">
          <li>
            <span className="plan-name">{plan.name || 'Workout'}</span>
            <span className="muted">{plan.WorkoutItems?.length ?? 0} exercises</span>
          </li>
        </ul>
      )}
    </Card>
  )
}

export default WorkoutSummary
