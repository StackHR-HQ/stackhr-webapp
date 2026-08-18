import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { APPLICABILITY_META } from '../../../payroll/lib/status-meta'
import type { StatutoryContributionRule } from '../../../payroll/types/payroll-types'

export function StatutoryContributionsCard({ rules }: { rules: StatutoryContributionRule[] }) {
  return (
    <Card>
      <CardHeader
        title="Applicable statutory contributions"
        description="Why each contribution does or doesn't apply to your organization"
        action={
          <Link to="/compliance/statutory" className="text-xs font-medium text-accent hover:underline">
            View details →
          </Link>
        }
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rules.map((rule) => {
          const meta = APPLICABILITY_META[rule.applicability]
          return (
            <li key={rule.id} className="rounded-lg border border-line bg-canvas p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">{rule.name}</p>
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted">
                {rule.employeeRatePercent > 0 ? `Employee ${rule.employeeRatePercent}% · ` : ''}
                {rule.employerRatePercent > 0 ? `Employer ${rule.employerRatePercent}%` : ''}
              </p>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
