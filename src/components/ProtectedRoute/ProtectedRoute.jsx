import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * Wraps routes that need a signed-in customer. Sends guests to the login page
 * and remembers where they were heading so login can bounce them back.
 *
 * The session is read synchronously on the first render (see AuthContext), so
 * there is nothing to wait for here. If the backend later has to validate a
 * token, add the loading branch back before the redirect — otherwise a
 * signed-in customer gets thrown out to /login on every refresh.
 */
export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
