import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatDate } from '../../lib/format'
import { REQUEST_STATUS_META } from '../../lib/status-meta'
import type { EmployeeDetail } from '../../types/people-types'

export function SalaryAdvancesTab({ employee }: { employee: EmployeeDetail }) {
  return (
    <Card>
      <CardHeader
        title="Salary advances"
        action={
          <Link to="/payroll/salary-advances" className="text-xs font-medium text-accent hover:underline">
            View all advances →
          </Link>
        }
      />
      {employee.salaryAdvances.length > 0 ? (
        <ul className="divide-y divide-line">
          {employee.salaryAdvances.map((advance) => {
            const statusMeta = REQUEST_STATUS_META[advance.status]
            return (
              <li key={advance.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{formatAmount(advance.amount, advance.currency)}</p>
                  <p className="text-xs text-muted">
                    Requested {formatDate(advance.requestedAt)} · {advance.repaymentMonths}-month repayment
                  </p>
                </div>
                <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted">No salary advances on record.</p>
      )}
    </Card>
  )
}
