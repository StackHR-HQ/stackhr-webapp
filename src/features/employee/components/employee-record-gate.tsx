import { IdentificationCardIcon } from '@phosphor-icons/react'
import { Outlet } from 'react-router'
import { isEmployeeRecordMissing, useMyProfile } from '../hooks/use-my-profile'

export function UnlinkedEmployeeNotice() {
  return (
    <div className="rounded-panel border border-line bg-surface px-6 py-14 text-center shadow-panel">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <IdentificationCardIcon className="h-7 w-7 text-accent" />
      </div>
      <p className="mt-5 text-base font-medium text-ink">No employee profile yet</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
        Your account is not linked to an employee profile in this organization. Contact your administrator to
        complete employee onboarding.
      </p>
    </div>
  )
}

// Wraps the self-service pages so each one doesn't fail on its own 404.
export function EmployeeRecordGate() {
  const { error } = useMyProfile()
  if (isEmployeeRecordMissing(error)) {
    return (
      <div className="mx-auto w-full max-w-5xl pb-8">
        <UnlinkedEmployeeNotice />
      </div>
    )
  }
  return <Outlet />
}
