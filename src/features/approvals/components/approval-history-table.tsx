import { Link } from 'react-router'
import { Avatar } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { formatAmount, formatDate } from '../lib/format'
import { APPROVAL_DOMAIN_META, APPROVAL_STATUS_META } from '../lib/status-meta'
import type { GlobalApprovalItem } from '../types/approval-types'

export function ApprovalHistoryTable({ items }: { items: GlobalApprovalItem[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No decisions have been made yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Request</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Decided by</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((item) => {
            const domainMeta = APPROVAL_DOMAIN_META[item.domain]
            const statusMeta = APPROVAL_STATUS_META[item.status]
            return (
              <tr key={`${item.domain}-${item.id}`} className="bg-canvas">
                <td className="px-4 py-3">
                  <Badge tone="neutral">{domainMeta.label}</Badge>
                </td>
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
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </td>
                <td className="px-4 py-3 text-muted">
                  {item.decidedBy ? `${item.decidedBy} · ${formatDate(item.decidedAt!)}` : item.decidedAt ? formatDate(item.decidedAt) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
