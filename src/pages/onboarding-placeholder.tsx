import { Link } from 'react-router'
import { useAuthStore } from '../features/auth/store/auth-store'

// Placeholder — the real onboarding flow is a separate feature, spec to follow.
export function OnboardingPlaceholder() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
        <h1 className="text-xl font-medium text-ink">Welcome, {user?.name}</h1>
        <p className="mt-2 text-sm text-muted">
          Onboarding for {user?.orgName} isn&apos;t built yet — it lands as its own feature.
        </p>
        <Link
          to="/"
          className="mt-5 block w-full rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-canvas"
        >
          Continue to dashboard
        </Link>
      </div>
    </div>
  )
}
