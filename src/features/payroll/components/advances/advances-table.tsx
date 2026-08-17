import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount, formatDate } from '../../lib/format'
import { ADVANCE_STATUS_META } from '../../lib/status-meta'
import type { SalaryAdvanceStatusEntry } from '../../types/payroll-types'

export function AdvancesTable({
  advances,
  onApprove,
  onReject,
  onDisburse,
}: {
  advances: SalaryAdvanceStatusEntry[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDisburse: (id: string) => void
}) {
  if (advances.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No salary advance requests match this filter.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Requested</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Repayment</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {advances.map((advance) => {
            const statusMeta = ADVANCE_STATUS_META[advance.status]
            return (
              <tr key={advance.id} className="bg-canvas">
                <td className="px-4 py-3">
                  <Link
                    to={`/people/employees/${advance.employeeId}`}
                    className="flex items-center gap-2.5 hover:underline"
                  >
                    <Avatar initials={advance.avatarInitials} size="sm" />
                    <span className="font-medium text-ink">{advance.employeeName}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(advance.requestedAt)}</td>
                <td className="px-4 py-3 text-ink">{formatAmount(advance.amount, advance.currency)}</td>
                <td className="px-4 py-3 text-muted">{advance.repaymentMonths} months</td>
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </td>
                <td className="px-4 py-3">
                  {advance.status === 'pending' ? (
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onReject(advance.id)}
                        aria-label={`Reject advance request from ${advance.employeeName}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-critical hover:text-critical"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onApprove(advance.id)}
                        aria-label={`Approve advance request from ${advance.employeeName}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-ink transition-opacity hover:opacity-90"
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : null}
                  {advance.status === 'approved' ? (
                    <button
                      type="button"
                      onClick={() => onDisburse(advance.id)}
                      className="ml-auto block rounded-lg bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-ink hover:opacity-90"
                    >
                      Mark disbursed
                    </button>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
