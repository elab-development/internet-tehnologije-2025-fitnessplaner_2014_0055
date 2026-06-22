import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getDailyLog,
  createDailyLog,
  updateHydration,
  addFoodEntry,
  updateFoodEntry,
  removeFoodEntry,
} from '../api/dailyLogs'
import { todayISO, formatLongDate } from '../lib/date'
import TopNav from '../components/TopNav'
import FoodSearch from '../components/nutrition/FoodSearch'
import FoodEntryRow from '../components/nutrition/FoodEntryRow'
import HydrationControl from '../components/nutrition/HydrationControl'
import NutritionCharts from '../components/nutrition/NutritionCharts'
import './home.css'
import './nutrition.css'

function Nutrition() {
  const today = todayISO()
  const [log, setLog] = useState(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getDailyLog(today)
      .then((data) => { if (active) setLog(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [today])

  async function refresh() {
    setLog(await getDailyLog(today))
  }

  async function ensureLogId() {
    if (log?.id) return log.id
    const created = await createDailyLog(today)
    setLog(created)
    return created.id
  }

  async function handleAddFood(foodId, grams) {
    const id = await ensureLogId()
    await addFoodEntry(id, foodId, grams)
    await refresh()
  }

  async function handleUpdateEntry(entryId, grams) {
    await updateFoodEntry(log.id, entryId, grams)
    await refresh()
  }

  async function handleRemoveEntry(entryId) {
    await removeFoodEntry(log.id, entryId)
    await refresh()
  }

  async function handleSetHydration(ml) {
    const id = await ensureLogId()
    await updateHydration(id, ml)
    await refresh()
  }

  const entries = log?.FoodEntries ?? []

  return (
    <div className="home">
      <TopNav />
      <main className="home-main">
        <Link to="/" className="back-link">← Back</Link>

        <header className="home-header">
          <h1>Nutrition</h1>
          <p className="muted">{formatLongDate(today)}</p>
        </header>

        {error && <p className="card-error">{error}</p>}
        {!error && log === undefined && <p className="muted">Loading…</p>}

        {!error && log !== undefined && (
          <div className="nutrition-layout">
            <section>
              <h2 className="section-title">Today's total</h2>
              <div className="metric">
                <span className="metric-value">{log?.calories ?? 0} <small>kcal</small></span>
              </div>
              <ul className="macros">
                <li><span className="muted">Protein</span>{log?.protein ?? 0} g</li>
                <li><span className="muted">Carbs</span>{log?.carbs ?? 0} g</li>
                <li><span className="muted">Fat</span>{log?.fat ?? 0} g</li>
              </ul>
            </section>

            <NutritionCharts log={log} entries={entries} />

            <FoodSearch onAdd={handleAddFood} />

            <section>
              <h2 className="section-title">Food</h2>
              {entries.length === 0 && <p className="muted">No food logged yet.</p>}
              {entries.length > 0 && (
                <ul className="entry-list">
                  {entries.map((entry) => (
                    <FoodEntryRow
                      key={entry.id}
                      entry={entry}
                      onUpdate={handleUpdateEntry}
                      onRemove={handleRemoveEntry}
                    />
                  ))}
                </ul>
              )}
            </section>

            <HydrationControl hydration={log?.hydration ?? 0} onChange={handleSetHydration} />
          </div>
        )}
      </main>
    </div>
  )
}

export default Nutrition
