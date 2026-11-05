import { CheckCircleIcon, CircleIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { onboardingApi } from '../api/onboarding-api'

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircleIcon size={16} weight="fill" className="shrink-0 text-positive" />
      ) : (
        <CircleIcon size={16} className="shrink-0 text-muted" />
      )}
      <span className={done ? 'text-muted line-through' : 'text-ink'}>{label}</span>
    </li>
  )
}

// Shown on the admin dashboard until the workspace setup is finished, e.g.
// when someone skipped the wizard after verifying their email.
export function FinishSetupBanner() {
  const status = useQuery({ queryKey: ['onboarding', 'status'], queryFn: () => onboardingApi.getStatus(), retry: false })
  if (!status.data || status.data.complete) return null

  const { companyInfoComplete, employeesComplete, employeeCount } = status.data
  return (
    <div className="flex flex-col gap-4 rounded-panel border border-accent/40 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-ink">Finish setting up your workspace</p>
        <p className="mt-0.5 text-sm text-muted">Payroll and approvals need these before you can use them.</p>
        <ul className="mt-3 space-y-1.5">
          <Step done={companyInfoComplete} label="Add your company details" />
          <Step
            done={employeesComplete}
            label={employeeCount > 0 ? `Add your employees (${employeeCount} so far)` : 'Add your employees'}
          />
        </ul>
      </div>
      <Link
        to="/onboarding"
        className="shrink-0 self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90 sm:self-center"
      >
        Continue setup
      </Link>
    </div>
  )
}
