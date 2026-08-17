import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount } from '../../lib/format'
import { APPLICABILITY_META } from '../../lib/status-meta'
import type { RunEmployeeLine, StatutoryContributionRule } from '../../types/payroll-types'

export function EmployerContributionsTab({
  lines,
  currency,
  statutoryContributions,
}: {
  lines: RunEmployeeLine[]
  currency: string
  statutoryContributions: StatutoryContributionRule[]
}) {
  const employerContributions = statutoryContributions.filter((rule) => rule.employerRatePercent > 0)

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Employer-paid contributions" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {employerContributions.map((rule) => {
            const meta = APPLICABILITY_META[rule.applicability]
            return (
              <div key={rule.id} className="rounded-lg border border-line bg-canvas p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{rule.name}</p>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {rule.employerRatePercent}% of {rule.base.toUpperCase()}
                </p>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="overflow-x-auto rounded-panel border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Pension (employer)</th>
              <th className="px-4 py-3 font-medium">Health (NHIA)</th>
              <th className="px-4 py-3 font-medium">NSITF</th>
              <th className="px-4 py-3 font-medium">Total contributions</th>
              <th className="px-4 py-3 font-medium">Employer cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lines.map((line) => (
              <tr key={line.employeeId} className="bg-canvas">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={line.avatarInitials} size="sm" />
                    <span className="font-medium text-ink">{line.employeeName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{formatAmount(line.pensionEmployer, currency)}</td>
                <td className="px-4 py-3 text-muted">{formatAmount(line.nhiaEmployer, currency)}</td>
                <td className="px-4 py-3 text-muted">{formatAmount(line.nsitfEmployer, currency)}</td>
                <td className="px-4 py-3 text-ink">{formatAmount(line.totalEmployerContributions, currency)}</td>
                <td className="px-4 py-3 text-ink">{formatAmount(line.employerCost, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
