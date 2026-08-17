import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { APPLICABILITY_META } from '../../lib/status-meta'
import { ComplianceWarningsList } from '../compliance-warnings-list'
import type { ComplianceWarning, StatutoryContributionRule } from '../../types/payroll-types'

export function ComplianceTab({
  warnings,
  statutoryContributions,
}: {
  warnings: ComplianceWarning[]
  statutoryContributions: StatutoryContributionRule[]
}) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Warnings" />
        <ComplianceWarningsList warnings={warnings} />
      </Card>

      <Card>
        <CardHeader title="Statutory contributions" description="Why each contribution does or doesn't apply" />
        <ul className="space-y-3">
          {statutoryContributions.map((rule) => {
            const meta = APPLICABILITY_META[rule.applicability]
            return (
              <li key={rule.id} className="rounded-lg border border-line bg-canvas p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{rule.name}</p>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted">{rule.explanation}</p>
                <p className="mt-2 text-xs text-muted">
                  {rule.employeeRatePercent > 0 ? `Employee ${rule.employeeRatePercent}% · ` : ''}
                  {rule.employerRatePercent > 0 ? `Employer ${rule.employerRatePercent}% · ` : ''}
                  Base: {rule.base.toUpperCase()} · {rule.legalReference}
                </p>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
