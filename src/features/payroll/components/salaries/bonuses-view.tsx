import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount, formatDate } from '../../lib/format'
import { PAYROLL_RUN_STATUS_META } from '../../lib/status-meta'
import type { BonusPayout } from '../../types/payroll-types'

export function BonusesView({ payouts }: { payouts: BonusPayout[] }) {
  if (payouts.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No bonus runs on record.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Bonus period</th>
            <th className="px-4 py-3 font-medium">Pay date</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {payouts.map((payout) => {
            const statusMeta = PAYROLL_RUN_STATUS_META[payout.status]
            return (
              <tr key={payout.employeeId} className="bg-canvas">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={payout.avatarInitials} size="sm" />
                    <span className="font-medium text-ink">{payout.employeeName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{payout.periodLabel}</td>
                <td className="px-4 py-3 text-muted">{formatDate(payout.payDate)}</td>
                <td className="px-4 py-3 text-ink">{formatAmount(payout.amount, payout.currency)}</td>
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
