import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import type { ExpenseClaim } from '../../types/spend-types'

export function ExpenseDecisionCard({ expense }: { expense: ExpenseClaim }) {
  return (
    <Card>
      <CardHeader title="Approval decision" />

      {expense.status === 'pending' ? (
        <p className="text-sm text-muted">Awaiting a decision from the spend approver.</p>
      ) : expense.status === 'rejected' ? (
        <div className="space-y-2">
          <p className="text-sm text-ink">
            Rejected by <span className="font-medium">{expense.decidedBy}</span>
            {expense.decidedAt ? ` · ${formatDate(expense.decidedAt)}` : ''}
          </p>
          {expense.rejectionReason ? (
            <p className="rounded-lg border border-critical/30 bg-critical/5 px-3 py-2 text-xs text-critical">
              {expense.rejectionReason}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-ink">
          Approved by <span className="font-medium">{expense.decidedBy}</span>
          {expense.decidedAt ? ` · ${formatDate(expense.decidedAt)}` : ''}
        </p>
      )}
    </Card>
  )
}
