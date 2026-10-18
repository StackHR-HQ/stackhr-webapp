import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../features/auth/store/auth-store'
import type { AuthUser } from '../features/auth/types/auth-types'

// Sends roles the backend would answer with 403 back to their dashboard.
export function RoleRoute({ allow }: { allow: AuthUser['role'][] }) {
  const role = useAuthStore((state) => state.user?.role)
  if (!role || !allow.includes(role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
