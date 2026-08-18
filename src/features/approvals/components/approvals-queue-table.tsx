import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { Avatar } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { formatAmount, formatDate } from '../lib/format'
import { APPROVAL_DOMAIN_META } from '../lib/status-meta'
import type { GlobalApprovalItem } from '../types/approval-types'

export function ApprovalsQueueTable({
  items,
  showDomain,
  onApprove,
  onReject,
}: {
  items: GlobalApprovalItem[]
  showDomain: boolean
  onApprove: (item: GlobalApprovalItem) => void
  onReject: (item: GlobalApprovalItem) => void
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        Nothing waiting on your review here.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            {showDomain ? <th className="px-4 py-3 font-medium">Type</th> : null}
            <th className="px-4 py-3 font-medium">Request</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Submitted</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((item) => {
            const domainMeta = APPROVAL_DOMAIN_META[item.domain]
            return (
              <tr key={`${item.domain}-${item.id}`} className="bg-canvas">
                {showDomain ? (
                  <td className="px-4 py-3">
                    <Badge tone="neutral">{domainMeta.label}</Badge>
                  </td>
                ) : null}
                <td className="px-4 py-3">
                  <Link to={item.detailPath} className="flex items-center gap-2.5 hover:underline">
                    {item.avatarInitials ? <Avatar initials={item.avatarInitials} size="sm" /> : null}
                    <span>
                      <span className="block font-medium text-ink">{item.title}</span>
                      <span className="block max-w-sm truncate text-xs text-muted">{item.subtitle}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-ink">
                  {item.amount != null && item.currency ? formatAmount(item.amount, item.currency) : '—'}
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(item.submittedAt)}</td>
                <td className="px-4 py-3">
                  {item.actionable ? (
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onReject(item)}
                        aria-label={`Reject request from ${item.title}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-critical hover:text-critical"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onApprove(item)}
                        aria-label={`Approve request from ${item.title}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-ink transition-opacity hover:opacity-90"
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <Link to={item.detailPath} className="ml-auto block w-fit text-xs font-medium text-accent hover:underline">
                      Review →
                    </Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
