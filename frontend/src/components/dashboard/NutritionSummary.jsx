import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDailyLog } from '../../api/dailyLogs'
import Card from '../Card'

function NutritionSummary({ date }) {
  const [log, setLog] = useState(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getDailyLog(date)
      .then((data) => { if (active) setLog(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [date])

  const calories = log?.calories ?? 0
  const protein = log?.protein ?? 0
  const carbs = log?.carbs ?? 0
  const fat = log?.fat ?? 0

  return (
    <Card title="Nutrition" action={<Link to="/nutrition">Log food</Link>}>
      {error && <p className="card-error">{error}</p>}
      {!error && log === undefined && <p className="muted">Loading…</p>}
      {!error && log !== undefined && (
        <>
          <div className="metric">
            <span className="metric-value">
              {calories} <small>kcal</small>
            </span>
          </div>

          <ul className="macros">
            <li><span className="muted">Protein</span>{protein} g</li>
            <li><span className="muted">Carbs</span>{carbs} g</li>
            <li><span className="muted">Fat</span>{fat} g</li>
          </ul>
        </>
      )}
    </Card>
  )
}

export default NutritionSummary
