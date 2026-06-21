import { Navigate } from 'react-router-dom'
import { getToken, getUser } from '../lib/auth'

function ProtectedRoute({ children, adminOnly = false }) {
  if (!getToken()) return <Navigate to="/login" replace />

  const isAdmin = getUser()?.role === 'admin'
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  if (!adminOnly && isAdmin) return <Navigate to="/users" replace />

  return children
}

export default ProtectedRoute
