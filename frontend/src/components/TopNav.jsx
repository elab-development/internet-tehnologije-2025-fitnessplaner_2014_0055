import { Link, useNavigate } from 'react-router-dom'
import { getUser, clearAuth } from '../lib/auth'
import { logout } from '../api/auth'

function TopNav() {
  const navigate = useNavigate()
  const user = getUser()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <header className="topnav">
      <Link to="/" className="brand">Fitness Planner</Link>
      <nav>
        <Link to="/workouts">Workouts</Link>
        <Link to="/nutrition">Nutrition</Link>
      </nav>
      <div className="topnav-user">
        <span>{user?.username}</span>
        <button type="button" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  )
}

export default TopNav
