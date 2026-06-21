import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, updateUserRole } from '../api/users'
import { getUser, clearAuth } from '../lib/auth'
import { logout } from '../api/auth'
import './admin.css'

const ROLES = ['user', 'trainer', 'admin']

function AdminUsers() {
  const navigate = useNavigate()
  const currentUser = getUser()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    try {
      await logout()
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <div className="admin">
      <header className="admin-bar">
        <span className="brand">Fitness Planner</span>
        <button type="button" className="logout" onClick={handleLogout}>Log out</button>
      </header>

      <main className="admin-main">
        <h1>Users</h1>

        {loading && <p className="muted">Loading…</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && (
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isSelf={user.id === currentUser?.id}
                />
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}

function UserRow({ user, isSelf }) {
  const [role, setRole] = useState(user.role)
  const [status, setStatus] = useState('')

  async function handleChange(e) {
    const nextRole = e.target.value
    const previous = role
    setRole(nextRole)
    setStatus('saving')
    try {
      await updateUserRole(user.id, nextRole)
      setStatus('saved')
    } catch {
      setRole(previous)
      setStatus('error')
    }
  }

  return (
    <tr>
      <td>{user.username}</td>
      <td className="muted">{user.email}</td>
      <td>
        <div className="role-cell">
          <select value={role} onChange={handleChange} disabled={isSelf || status === 'saving'}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {isSelf && <span className="role-status muted">You</span>}
          {status === 'saving' && <span className="role-status muted">Saving…</span>}
          {status === 'saved' && <span className="role-status saved">Saved</span>}
          {status === 'error' && <span className="role-status error">Failed</span>}
        </div>
      </td>
    </tr>
  )
}

export default AdminUsers
