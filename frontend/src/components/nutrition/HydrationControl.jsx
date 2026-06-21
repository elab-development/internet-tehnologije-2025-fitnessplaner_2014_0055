import { useState } from 'react'

function HydrationControl({ hydration, onChange }) {
  const [amount, setAmount] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function apply(value) {
    setBusy(true)
    setError('')
    try {
      await onChange(value)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function setExact(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!Number.isInteger(value) || value < 0) return
    apply(value)
    setAmount('')
  }

  return (
    <section>
      <h2 className="section-title">Hydration</h2>
      <div className="metric">
        <span className="metric-value">{hydration} <small>ml</small></span>
      </div>
      <div className="hydration-actions">
        <button type="button" onClick={() => apply(hydration + 250)} disabled={busy}>+250 ml</button>
        <button type="button" onClick={() => apply(hydration + 500)} disabled={busy}>+500 ml</button>
        <form className="hydration-set" onSubmit={setExact}>
          <input
            type="number"
            min="0"
            placeholder="Set ml"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="set hydration in ml"
          />
          <button type="submit" disabled={busy}>Set</button>
        </form>
      </div>
      {error && <p className="card-error">{error}</p>}
    </section>
  )
}

export default HydrationControl
