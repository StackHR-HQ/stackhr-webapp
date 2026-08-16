import { Button } from '../../../components/ui/button'
import { currencySymbol } from '../constants/onboarding-options'
import { useCompleteOnboarding } from '../hooks/use-complete-onboarding'
import { EmployeeListTable } from './employee-list-table'
import type { CompanyInfo, EmployeeDraft } from '../types/onboarding-types'

export function ReviewStep({
  companyInfo,
  employees,
  onEditCompany,
  onEditEmployees,
  onBack,
  onFinish,
}: {
  companyInfo: CompanyInfo
  employees: EmployeeDraft[]
  onEditCompany: () => void
  onEditEmployees: () => void
  onBack: () => void
  onFinish: () => void
}) {
  const completeOnboarding = useCompleteOnboarding()

  if (completeOnboarding.isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-positive/15 text-positive">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12l5 5L19 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-medium text-ink">You&apos;re all set!</h1>
        <p className="mt-1 text-sm text-muted">
          {companyInfo.name} is ready on StackHR with {employees.length} employee{employees.length === 1 ? '' : 's'}{' '}
          on board.
        </p>
        <Button type="button" onClick={onFinish} className="mx-auto mt-8 max-w-xs">
          Go to dashboard
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-ink">Review &amp; finish</h1>
      <p className="mt-1 text-sm text-muted">Double-check everything before we set up your workspace.</p>

      {completeOnboarding.isError ? (
        <div role="alert" className="mt-4 rounded-lg border border-critical/30 bg-critical/10 p-3 text-sm text-critical">
          Something went wrong saving your workspace. Please try again.
        </div>
      ) : null}

      <div className="mt-6 rounded-panel border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium text-ink">Company</p>
          <button type="button" onClick={onEditCompany} className="text-sm text-accent hover:underline">
            Edit
          </button>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted">Name</dt>
          <dd className="text-ink">{companyInfo.name}</dd>
          <dt className="text-muted">Industry</dt>
          <dd className="text-ink">{companyInfo.industry}</dd>
          <dt className="text-muted">Company size</dt>
          <dd className="text-ink">{companyInfo.companySize} employees</dd>
          <dt className="text-muted">Currency</dt>
          <dd className="text-ink">
            {companyInfo.currency} ({currencySymbol(companyInfo.currency)})
          </dd>
          <dt className="text-muted">Payroll frequency</dt>
          <dd className="text-ink">{companyInfo.payrollFrequency}</dd>
          <dt className="text-muted">Tax ID</dt>
          <dd className="text-ink">{companyInfo.taxId || 'Not provided'}</dd>
        </dl>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-medium text-ink">
            Employees ({employees.length})
          </p>
          <button type="button" onClick={onEditEmployees} className="text-sm text-accent hover:underline">
            Edit
          </button>
        </div>
        <EmployeeListTable employees={employees} currency={companyInfo.currency} />
      </div>

      <div className="mt-8 flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} className="w-auto px-6">
          Back
        </Button>
        <Button
          type="button"
          onClick={() => completeOnboarding.mutate({ companyInfo, employees })}
          disabled={completeOnboarding.isPending}
        >
          {completeOnboarding.isPending ? 'Setting up…' : 'Complete setup'}
        </Button>
      </div>
    </div>
  )
}
