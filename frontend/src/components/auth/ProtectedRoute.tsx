import { Navigate, useLocation } from 'react-router-dom'
import { LoadingBlock } from '../ui/State'
import { useSession } from '../../contexts/SessionContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, message } = useSession()
  const location = useLocation()
  if (isLoading) return <main className="route-loading"><LoadingBlock label="Checking your secure session…" /></main>
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname, sessionExpired: true, sessionMessage: message }} />
  return <>{children}</>
}
