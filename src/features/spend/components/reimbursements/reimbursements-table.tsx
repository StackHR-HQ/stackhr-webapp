import { useNavigate } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount, formatDate } from '../../lib/format'
import { REIMBURSEMENT_STATUS_META } from '../../lib/status-meta'
import type { Reimbursement } from '../../types/spend-types'

export function ReimbursementsTable({
  reimbursements,
  onMarkPaid,
}: {
  reimbursements: Reimbursement[]
  // Only passed for roles allowed to pay out.
  onMarkPaid?: (reimbursement: Reimbursement) => void
}) {
  const navigate = useNavigate()

  if (reimbursements.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No reimbursements match this filter.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Claim</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Requested</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {onMarkPaid ? <th className="px-4 py-3 font-medium" aria-label="Actions" /> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {reimbursements.map((reimbursement) => {
            const statusMeta = REIMBURSEMENT_STATUS_META[reimbursement.status]
            const expensePath = reimbursement.expenseId ? `/spend/expenses/${reimbursement.expenseId}` : undefined
            return (
              <tr
                key={reimbursement.id}
                onClick={expensePath ? () => navigate(expensePath) : undefined}
                className={`bg-canvas transition-colors ${expensePath ? 'cursor-pointer hover:bg-surface' : ''}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={reimbursement.avatarInitials} size="sm" />
                    <span className="font-medium text-ink">{reimbursement.employeeName}</span>
                  </div>
                </td>
                <td className="max-w-[280px] px-4 py-3">
                  <p className="text-ink">{reimbursement.category}</p>
                  {reimbursement.description ? (
                    <p className="truncate text-xs text-muted">{reimbursement.description}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 font-medium text-ink">
                  {formatAmount(reimbursement.amount, reimbursement.currency)}
                </td>
                <td className="px-4 py-3 text-muted">
                  {reimbursement.requestedAt ? formatDate(reimbursement.requestedAt) : '—'}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                  {reimbursement.failureReason ? (
                    <p className="mt-1 text-xs text-critical">{reimbursement.failureReason}</p>
                  ) : null}
                </td>
                {onMarkPaid ? (
                  <td className="px-4 py-3 text-right">
                    {reimbursement.status === 'approved' ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onMarkPaid(reimbursement)
                        }}
                        className="whitespace-nowrap text-sm font-medium text-accent hover:underline"
                      >
                        Mark as paid
                      </button>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
