import { Avatar } from '../../../../components/ui/avatar'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatDate } from '../../lib/format'
import type { RunEmployeeLine, TaxRuleSet } from '../../types/payroll-types'

export function TaxTab({
  taxRuleSet,
  lines,
  currency,
}: {
  taxRuleSet: TaxRuleSet
  lines: RunEmployeeLine[]
  currency: string
}) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title={taxRuleSet.label} description={`Effective from ${formatDate(taxRuleSet.effectiveFrom)}`} />
        <p className="text-sm text-muted">{taxRuleSet.description}</p>
      </Card>

      <div className="overflow-x-auto rounded-panel border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Gross pay</th>
              <th className="px-4 py-3 font-medium">PAYE</th>
              <th className="px-4 py-3 font-medium">Effective rate</th>
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
                <td className="px-4 py-3 text-muted">{formatAmount(line.grossPay, currency)}</td>
                <td className="px-4 py-3 text-ink">{formatAmount(line.paye, currency)}</td>
                <td className="px-4 py-3 text-muted">{((line.paye / line.grossPay) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
