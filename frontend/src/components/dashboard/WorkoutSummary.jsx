import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getWorkoutPlans, createWorkoutPlan } from '../../api/workoutPlans'
import Card from '../Card'

function WorkoutSummary({ date }) {
  const [plan, setPlan] = useState(undefined)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    getWorkoutPlans(date)
      .then((data) => { if (active) setPlan(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [date])

  async function handleCreate() {
    setCreating(true)
    setError('')
    try {
      const created = await createWorkoutPlan(date)
      navigate(`/workouts/${created.id}`)
    } catch (err) {
      setError(err.message)
      setCreating(false)
    }
  }

  const action = plan
    ? <Link to={`/workouts/${plan.id}`}>View</Link>
    : null

  return (
    <Card title="Today's workout" accent="green" action={action}>
      {error && <p className="card-error">{error}</p>}
      {!error && plan === undefined && <p className="muted">Loading…</p>}
      {!error && plan === null && (
        <p className="muted">
          No workout planned for today.{' '}
          <button type="button" className="link-button" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating…' : 'Plan one →'}
          </button>
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
