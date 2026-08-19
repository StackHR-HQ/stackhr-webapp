import { Card, CardHeader } from '../../../components/ui/card'
import { ComplianceWarningsList } from '../../payroll/components/compliance-warnings-list'
import { usePayrollOverview } from '../../payroll/hooks/use-payroll-overview'
import { ActiveTaxRuleCard } from '../components/overview/active-tax-rule-card'
import { ComplianceStatTiles } from '../components/overview/compliance-stat-tiles'
import { OutstandingActionsCard } from '../components/overview/outstanding-actions-card'
import { StatutoryContributionsCard } from '../components/overview/statutory-contributions-card'

export function ComplianceOverviewPage() {
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
        <p className="text-sm font-medium text-ink">Couldn't load compliance data</p>
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

  const { currentRun, complianceWarnings } = data

  return (
    <div className="max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-medium text-ink">Compliance</h1>
        <p className="mt-1 text-sm text-muted">
          Tax rules, statutory contributions, and outstanding compliance actions in one place.
        </p>
      </div>

      <ComplianceStatTiles
        taxRuleSet={currentRun.taxRuleSet}
        statutoryContributions={currentRun.statutoryContributions}
        warnings={complianceWarnings}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ActiveTaxRuleCard taxRuleSet={currentRun.taxRuleSet} />
          <StatutoryContributionsCard rules={currentRun.statutoryContributions} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Warnings" description={`For ${currentRun.periodLabel}`} />
            <ComplianceWarningsList warnings={complianceWarnings} />
          </Card>
          <OutstandingActionsCard warnings={complianceWarnings} resolvePath={`/payroll/runs/${currentRun.id}`} />
        </div>
      </div>
    </div>
  )
}
