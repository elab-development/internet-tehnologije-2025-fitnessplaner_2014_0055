import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWorkoutPlans } from '../../api/workoutPlans'
import Card from '../Card'

function WorkoutSummary({ date }) {
  const [plans, setPlans] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getWorkoutPlans(date)
      .then((data) => { if (active) setPlans(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [date])

  return (
    <Card title="Today's workout" action={<Link to="/workouts">View</Link>}>
      {error && <p className="card-error">{error}</p>}
      {!error && plans === null && <p className="muted">Loading…</p>}
      {!error && plans?.length === 0 && (
        <p className="muted">
          No workout planned for today. <Link to="/workouts">Plan one →</Link>
        </p>
      )}
      {!error && plans?.length > 0 && (
        <ul className="plan-list">
          {plans.map((plan) => (
            <li key={plan.id}>
              <span className="plan-name">{plan.name || 'Workout'}</span>
              <span className="muted">{plan.WorkoutItems?.length ?? 0} exercises</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default WorkoutSummary
