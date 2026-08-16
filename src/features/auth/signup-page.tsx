import { Link } from 'react-router'

// Placeholder target for the login page's "Sign up" link. The actual
// sign-up flow (workspace creation, plan selection, etc.) is a separate
// piece of work — this just keeps the link from being dead.
export function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="rounded-panel border border-line bg-surface p-6 shadow-panel">
          <h1 className="text-2xl font-medium text-ink">Sign up</h1>
          <p className="mt-2 text-sm text-muted">Account creation isn&apos;t available yet.</p>
        </div>
        <p className="mt-5 text-sm text-muted">
          <Link to="/login" className="text-accent hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
