import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatDate } from '../../lib/format'
import { REQUEST_STATUS_META } from '../../lib/status-meta'
import type { EmployeeDetail } from '../../types/people-types'

export function ExpensesTab({ employee }: { employee: EmployeeDetail }) {
  return (
    <Card>
      <CardHeader
        title="Expense claims"
        action={
          <Link to="/spend/expenses" className="text-xs font-medium text-accent hover:underline">
            View all expenses →
          </Link>
        }
      />
      {employee.expenses.length > 0 ? (
        <ul className="divide-y divide-line">
          {employee.expenses.map((expense) => {
            const statusMeta = REQUEST_STATUS_META[expense.status]
            return (
              <li key={expense.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{expense.description}</p>
                  <p className="text-xs text-muted">
                    {expense.category} · {formatDate(expense.date)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-medium text-ink">{formatAmount(expense.amount, expense.currency)}</span>
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted">No expense claims on record.</p>
      )}
    </Card>
  )
}
