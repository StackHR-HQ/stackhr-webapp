import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount, formatDate } from '../../lib/format'
import { SPEND_APPROVAL_STATUS_META } from '../../lib/status-meta'
import type { SpendApprovalRequest } from '../../types/spend-types'

export function ApprovalsTable({
  requests,
  onApprove,
  onReject,
}: {
  requests: SpendApprovalRequest[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  const showActions = Boolean(onApprove && onReject)
  const showDecision = requests.some((request) => request.status !== 'pending')

  if (requests.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No approval requests match this filter.
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
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Submitted</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {showDecision ? <th className="px-4 py-3 font-medium">Decided by</th> : null}
            {showActions ? <th className="px-4 py-3" /> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {requests.map((request) => {
            const statusMeta = SPEND_APPROVAL_STATUS_META[request.status]
            const isPending = request.status === 'pending'
            return (
              <tr key={request.id} className="bg-canvas">
                <td className="px-4 py-3">
                  <Link to={`/spend/expenses/${request.expenseId}`} className="flex items-center gap-2.5 hover:underline">
                    <Avatar initials={request.avatarInitials} size="sm" />
                    <span className="font-medium text-ink">{request.employeeName}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink">{request.category}</td>
                <td className="px-4 py-3 text-muted">
                  <span className="block max-w-xs truncate">{request.description}</span>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{formatAmount(request.amount, request.currency)}</td>
                <td className="px-4 py-3 text-muted">{formatDate(request.submittedAt)}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </td>
                {showDecision ? (
                  <td className="px-4 py-3 text-muted">
                    {request.decidedBy ? `${request.decidedBy} · ${formatDate(request.decidedAt!)}` : '—'}
                  </td>
                ) : null}
                {showActions ? (
                  <td className="px-4 py-3">
                    {isPending ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onReject?.(request.id)}
                          aria-label={`Reject expense claim from ${request.employeeName}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-critical hover:text-critical"
                        >
                          <XIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onApprove?.(request.id)}
                          aria-label={`Approve expense claim from ${request.employeeName}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-ink transition-opacity hover:opacity-90"
                        >
                          <CheckIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
