import { Badge, type BadgeTone } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatDate } from '../../../dashboard/lib/format'
import type { BillingHistoryEntry, BillingTransactionStatus } from '../../types/settings-types'

const STATUS_TONE: Record<BillingTransactionStatus, BadgeTone> = {
  paid: 'positive',
  pending: 'warning',
  failed: 'critical',
}

export function BillingHistoryView({ billingHistory }: { billingHistory: BillingHistoryEntry[] }) {
  return (
    <Card>
      <CardHeader title="Billing History" description="Past charges against your subscription." />
      {billingHistory.length === 0 ? (
        <p className="text-sm text-muted">No billing history yet.</p>
      ) : (
        <div className="divide-y divide-line">
          {billingHistory.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink">{entry.description}</p>
                <p className="mt-0.5 text-xs text-muted">{formatDate(entry.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-ink">{formatAmount(entry.amount, entry.currency)}</p>
                <Badge tone={STATUS_TONE[entry.status]}>{entry.status[0].toUpperCase() + entry.status.slice(1)}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
