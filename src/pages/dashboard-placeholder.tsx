import { useNavigate } from 'react-router'
import { useAuthStore } from '../features/auth/store/auth-store'

// Stands in for the real app shell until routing/features land here.
export function DashboardPlaceholder() {
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
        <h1 className="text-xl font-medium text-ink">Signed in</h1>
        <p className="mt-2 text-sm text-muted">
          {user?.name} · {user?.orgName}
        </p>
        <button
          type="button"
          onClick={() => {
            clearSession()
            navigate('/login', { replace: true })
          }}
          className="mt-5 w-full rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-canvas"
        >
          Log out
        </button>
      </div>
    </div>
  )
}
