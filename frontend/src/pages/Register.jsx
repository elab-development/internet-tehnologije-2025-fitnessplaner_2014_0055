import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { saveAuth } from '../lib/auth'
import './auth.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ username, email, password }) {
  const errors = {}
  if (!username) errors.username = 'Username is required'
  if (!email) errors.email = 'Email is required'
  else if (!emailPattern.test(email)) errors.email = 'Enter a valid email'
  if (!password) errors.password = 'Password is required'
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters'
  return errors
}

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      const data = await register(form)
      saveAuth(data)
      navigate('/')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth">
      <div className="auth-card">
        <p className="auth-brand">Fitness Planner</p>
        <h1>Create account</h1>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          {formError && <p className="form-error">{formError}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  )
}

export default Register
