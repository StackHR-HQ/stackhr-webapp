import { useAuthStore } from '../../auth/store/auth-store'
import { ComplianceAlertsCard } from '../components/home/compliance-alerts-card'
import { DashboardSkeleton } from '../components/home/dashboard-skeleton'
import { OverviewStats } from '../components/home/overview-stats'
import { PayrollStatusCard } from '../components/home/payroll-status-card'
import { PendingApprovalsCard } from '../components/home/pending-approvals-card'
import { RecentActivityCard } from '../components/home/recent-activity-card'
import { SubscriptionStatusCard } from '../components/home/subscription-status-card'
import { UpcomingPayrollCard } from '../components/home/upcoming-payroll-card'
import { useDashboardSummary } from '../hooks/use-dashboard-summary'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardHomePage() {
  const user = useAuthStore((state) => state.user)
  const { data, isPending, isError, refetch } = useDashboardSummary()
  const firstName = user?.name?.split(' ')[0]

  if (isPending) {
    return <DashboardSkeleton />
  }

  if (isError) {
    return (
      <div className="max-w-md rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
        <p className="text-sm font-medium text-ink">Couldn't load your dashboard</p>
        <p className="mt-1 text-sm text-muted">Something went wrong while fetching today's summary.</p>
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
        <h1 className="text-xl font-medium text-ink">
          {greeting()}
          {firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here's what needs your attention today at {user?.orgName ?? 'your organization'}.
        </p>
      </div>

      <OverviewStats overview={data.overview} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PayrollStatusCard payroll={data.payroll} />
          <PendingApprovalsCard categories={data.approvalCategories} />
          <RecentActivityCard activity={data.recentActivity} />
        </div>

        <div className="space-y-6">
          <UpcomingPayrollCard runs={data.upcomingPayroll} />
          <ComplianceAlertsCard alerts={data.complianceAlerts} />
          <SubscriptionStatusCard subscription={data.subscription} />
        </div>
      </div>
    </div>
  )
}
