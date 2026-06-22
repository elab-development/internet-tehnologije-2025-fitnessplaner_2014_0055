import { Navigate } from 'react-router-dom'
import { getToken, getUser } from '../lib/auth'

function ProtectedRoute({ children, adminOnly = false, trainerOnly = false }) {
  if (!getToken()) return <Navigate to="/login" replace />

  const role = getUser()?.role

  if (role === 'admin' && !adminOnly) return <Navigate to="/users" replace />
  if (role === 'trainer' && !trainerOnly) return <Navigate to="/manage-exercises" replace />

  if (adminOnly && role !== 'admin') return <Navigate to="/" replace />
  if (trainerOnly && role !== 'trainer') return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute
