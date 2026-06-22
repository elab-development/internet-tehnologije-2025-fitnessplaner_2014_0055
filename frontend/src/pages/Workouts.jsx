import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWorkoutPlansInRange } from '../api/workoutPlans'
import { todayISO, formatLongDate } from '../lib/date'
import TopNav from '../components/TopNav'
import './home.css'
import './workouts.css'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function pad(n) {
  return String(n).padStart(2, '0')
}

function isoOf(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

function monthGrid(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leading = (new Date(year, month, 1).getDay() + 6) % 7
  const cells = Array(leading).fill(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)
  return { cells, daysInMonth }
}

function Workouts() {
  const today = todayISO()
  const [view, setView] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [plansByDate, setPlansByDate] = useState(null)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  const { cells, daysInMonth } = useMemo(
    () => monthGrid(view.year, view.month),
    [view],
  )

  useEffect(() => {
    let active = true
    const from = isoOf(view.year, view.month, 1)
    const to = isoOf(view.year, view.month, daysInMonth)
    getWorkoutPlansInRange(from, to)
      .then((plans) => {
        if (!active) return
        const map = {}
        for (const plan of plans) map[plan.date] = plan
        setPlansByDate(map)
        setError('')
      })
      .catch((err) => { if (active) { setPlansByDate({}); setError(err.message) } })
    return () => { active = false }
  }, [view, daysInMonth])

  const loading = plansByDate === null

  function shiftMonth(delta) {
    setSelected(null)
    setPlansByDate(null)
    setView(({ year, month }) => {
      const next = new Date(year, month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const selectedPlan = selected ? plansByDate?.[selected] : null
  const selectedItems = selectedPlan?.WorkoutItems ?? []

  return (
    <div className="home">
      <TopNav />
      <main className="home-main">
        <Link to="/" className="back-link">← Back</Link>

        <header className="home-header">
          <h1>Workouts</h1>
          <p className="muted">Browse your plans by day.</p>
        </header>

        {error && <p className="card-error">{error}</p>}

        <div className="calendar">
          <div className="calendar-nav">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">←</button>
            <span className="calendar-month">{monthLabel}</span>
            <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">→</button>
          </div>

          <div className="calendar-grid calendar-weekdays">
            {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
          </div>

          <div className="calendar-grid">
            {cells.map((day, index) => {
              if (day === null) return <span key={`blank-${index}`} className="calendar-blank" />
              const iso = isoOf(view.year, view.month, day)
              const classes = ['calendar-day']
              if (plansByDate?.[iso]) classes.push('has-plan')
              if (iso === selected) classes.push('selected')
              if (iso === today) classes.push('today')
              return (
                <button
                  key={iso}
                  type="button"
                  className={classes.join(' ')}
                  onClick={() => setSelected(iso)}
                >
                  {day}
                </button>
              )
            })}
          </div>
          {loading && <p className="muted calendar-loading">Loading…</p>}
        </div>

        {selected && (
          <section className="day-panel">
            <h2 className="section-title">{formatLongDate(selected)}</h2>
            {!selectedPlan && <p className="muted">No workout planned.</p>}
            {selectedPlan && (
              <>
                <p className="plan-name">{selectedPlan.name || 'Workout'}</p>
                {selectedItems.length === 0 && <p className="muted">No exercises.</p>}
                {selectedItems.length > 0 && (
                  <ul className="entry-list">
                    {selectedItems.map((item) => (
                      <li key={item.id} className="entry-row">
                        <span className="exercise-name">{item.Exercise?.name}</span>
                        <span className="muted">{item.sets} × {item.reps}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default Workouts
