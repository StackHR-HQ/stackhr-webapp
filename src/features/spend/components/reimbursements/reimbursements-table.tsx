import { useNavigate } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount, formatDate } from '../../lib/format'
import { REIMBURSEMENT_STATUS_META } from '../../lib/status-meta'
import type { Reimbursement } from '../../types/spend-types'

export function ReimbursementsTable({ reimbursements }: { reimbursements: Reimbursement[] }) {
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
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Method</th>
            <th className="px-4 py-3 font-medium">Requested</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {reimbursements.map((reimbursement) => {
            const statusMeta = REIMBURSEMENT_STATUS_META[reimbursement.status]
            return (
              <tr
                key={reimbursement.id}
                onClick={() => navigate(`/spend/expenses/${reimbursement.expenseId}`)}
                className="cursor-pointer bg-canvas transition-colors hover:bg-surface"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={reimbursement.avatarInitials} size="sm" />
                    <span className="font-medium text-ink">{reimbursement.employeeName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink">{reimbursement.category}</td>
                <td className="px-4 py-3 font-medium text-ink">
                  {formatAmount(reimbursement.amount, reimbursement.currency)}
                </td>
                <td className="px-4 py-3 text-muted">{reimbursement.method}</td>
                <td className="px-4 py-3 text-muted">{formatDate(reimbursement.requestedAt)}</td>
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
