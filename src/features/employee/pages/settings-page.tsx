import { PasswordView } from '../../settings/components/security/password-view'

// Changing password is the only employee setting the backend supports.
export function EmployeeSettingsPage() {
  return (
    <div className="max-w-[900px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage how you sign in to StackHR.</p>
      </div>
      <PasswordView />
    </div>
  )
}
