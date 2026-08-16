import { useAuthStore } from '../../auth/store/auth-store'

export function DashboardHomePage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div>
      <h1 className="text-xl font-medium text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        {user?.name} · {user?.orgName}
      </p>
    </div>
  )
}
