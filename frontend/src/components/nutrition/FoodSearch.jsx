import { useEffect, useState } from 'react'
import { searchFoods } from '../../api/foods'

function FoodSearch({ onAdd }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [grams, setGrams] = useState('100')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const q = query.trim()
    let active = true
    const timer = setTimeout(() => {
      if (q.length < 3) {
        setResults([])
        setSearching(false)
        return
      }
      setSearching(true)
      setError('')
      searchFoods(q)
        .then((data) => { if (active) setResults(data) })
        .catch((err) => { if (active) setError(err.message) })
        .finally(() => { if (active) setSearching(false) })
    }, 300)
    return () => { active = false; clearTimeout(timer) }
  }, [query])

  async function handleAdd(e) {
    e.preventDefault()
    const amount = Number(grams)
    if (!selected || !Number.isFinite(amount) || amount <= 0) return
    setAdding(true)
    setError('')
    try {
      await onAdd(selected.id, amount)
      setSelected(null)
      setGrams('100')
      setQuery('')
      setResults([])
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const noMatches = !searching && query.trim().length >= 3 && results.length === 0 && !error

  return (
    <section>
      <h2 className="section-title">Add food</h2>
      <input
        type="search"
        className="search-input"
        placeholder="Search foods…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <p className="card-error">{error}</p>}
      {searching && <p className="muted">Searching…</p>}
      {noMatches && <p className="muted">No matches.</p>}

      {query.trim().length >= 3 && results.length > 0 && (
        <ul className="result-list">
          {results.map((food) => (
            <li key={food.id}>
              <button
                type="button"
                className={`result${selected?.id === food.id ? ' result-selected' : ''}`}
                onClick={() => setSelected(food)}
              >
                <span className="food-name">{food.name}</span>
                <span className="muted">{Math.round(food.caloriesPer100g ?? 0)} kcal/100g</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <form className="add-form" onSubmit={handleAdd}>
          <span className="food-name">{selected.name}</span>
          <input
            type="number"
            min="1"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            aria-label="grams"
          />
          <span className="muted">g</span>
          <button type="submit" disabled={adding}>Add</button>
        </form>
      )}
    </section>
  )
}

export default FoodSearch
