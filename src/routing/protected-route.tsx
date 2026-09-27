import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useSyncSession } from '../features/auth/hooks/use-sync-session'
import { useAuthStore } from '../features/auth/store/auth-store'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  useSyncSession()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
