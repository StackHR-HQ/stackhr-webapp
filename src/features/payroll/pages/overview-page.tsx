import { Link } from 'react-router'
import { Card } from '../../../components/ui/card'
import { ComplianceWarningsCard } from '../components/overview/compliance-warnings-card'
import { CurrentPayrollCard } from '../components/overview/current-payroll-card'
import { PayrollOverviewStats } from '../components/overview/payroll-overview-stats'
import { PreviousPayrollsCard } from '../components/overview/previous-payrolls-card'
import { UpcomingPayrollCard } from '../components/overview/upcoming-payroll-card'
import { usePayrollOverview } from '../hooks/use-payroll-overview'

export function PayrollOverviewPage() {
  const { data, isPending, isError, refetch } = usePayrollOverview()

  if (isPending) {
    return (
      <div className="max-w-[1400px] space-y-6">
        <div className="h-16 animate-pulse rounded-panel border border-line bg-surface" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-panel border border-line bg-surface" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
            <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
          </div>
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
            <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="max-w-md rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
        <p className="text-sm font-medium text-ink">Couldn't load payroll overview</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-medium text-ink">Payroll Overview</h1>
        <p className="mt-1 text-sm text-muted">Where payroll stands right now, and what needs your review.</p>
      </div>

      {data.currentRun ? (
        <PayrollOverviewStats summary={data.currentRun.summary} nextPayDate={data.currentRun.payDate} />
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {data.currentRun ? (
            <CurrentPayrollCard run={data.currentRun} />
          ) : (
            <Card>
              <div className="py-6 text-center">
                <p className="text-sm font-medium text-ink">No payroll runs yet</p>
                <p className="mt-1 text-sm text-muted">Your first run will show here once it&apos;s created.</p>
                <Link to="/payroll/runs" className="mt-3 inline-block text-xs font-medium text-accent hover:underline">
                  Go to payroll runs →
                </Link>
              </div>
            </Card>
          )}
          <PreviousPayrollsCard runs={data.previousRuns} />
        </div>

        <div className="space-y-6">
          <UpcomingPayrollCard runs={data.upcomingRuns} />
          <ComplianceWarningsCard warnings={data.complianceWarnings} />
        </div>
      </div>
    </div>
  )
}
