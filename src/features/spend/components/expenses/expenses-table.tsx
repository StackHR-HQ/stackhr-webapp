import { useNavigate } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount, formatDate } from '../../lib/format'
import { EXPENSE_STATUS_META } from '../../lib/status-meta'
import type { ExpenseClaim } from '../../types/spend-types'

export function ExpensesTable({ expenses }: { expenses: ExpenseClaim[] }) {
  const navigate = useNavigate()

  if (expenses.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No expenses match your filters.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {expenses.map((expense) => {
            const statusMeta = EXPENSE_STATUS_META[expense.status]
            return (
              <tr
                key={expense.id}
                onClick={() => navigate(`/spend/expenses/${expense.id}`)}
                className="cursor-pointer bg-canvas transition-colors hover:bg-surface"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={expense.avatarInitials} size="sm" />
                    <span className="font-medium text-ink">{expense.employeeName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink">{expense.category}</td>
                <td className="px-4 py-3 text-muted">
                  <span className="block max-w-xs truncate">{expense.description}</span>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(expense.date)}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatAmount(expense.amount, expense.currency)}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
