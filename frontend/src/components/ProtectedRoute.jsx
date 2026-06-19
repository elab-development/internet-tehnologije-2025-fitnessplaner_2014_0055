import { Navigate } from 'react-router-dom'
import { getToken } from '../lib/auth'

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
