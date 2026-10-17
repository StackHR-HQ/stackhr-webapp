import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { APPLICABILITY_META } from '../../../payroll/lib/status-meta'
import type { StatutoryContributionRule } from '../../../payroll/types/payroll-types'

export function StatutoryRuleDetail({ rule }: { rule: StatutoryContributionRule }) {
  const meta = APPLICABILITY_META[rule.applicability]
  // NHIA has no rate in the rule set, so there's no base to show either.
  const hasRate = rule.employeeRatePercent > 0 || rule.employerRatePercent > 0

  return (
    <Card>
      <CardHeader title={rule.name} description={rule.legalReference} action={<Badge tone={meta.tone}>{meta.label}</Badge>} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3">
          <p className="text-xs text-muted">Employee rate</p>
          <p className="mt-1 text-sm font-medium text-ink">{rule.employeeRatePercent}%</p>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3">
          <p className="text-xs text-muted">Employer rate</p>
          <p className="mt-1 text-sm font-medium text-ink">{rule.employerRatePercent}%</p>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3">
          <p className="text-xs text-muted">Contribution base</p>
          <p className="mt-1 text-sm font-medium text-ink">{hasRate ? rule.base.toUpperCase() : '—'}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">{rule.explanation}</p>
    </Card>
  )
}
