import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount, formatDate } from '../../lib/format'
import { EXPENSE_STATUS_META } from '../../lib/status-meta'
import type { ExpenseClaim } from '../../types/spend-types'

export function ExpenseDetailHeader({ expense }: { expense: ExpenseClaim }) {
  const statusMeta = EXPENSE_STATUS_META[expense.status]

  return (
    <div className="rounded-panel border border-line bg-surface p-5 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar initials={expense.avatarInitials} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-medium text-ink">{expense.description}</h1>
              <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {expense.employeeName} · {expense.category} · {formatDate(expense.date)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted">Amount</p>
          <p className="text-lg font-medium text-ink">{formatAmount(expense.amount, expense.currency)}</p>
        </div>
      </div>
    </div>
  )
}
