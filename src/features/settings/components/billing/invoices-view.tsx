import { Badge, type BadgeTone } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatDate } from '../../../dashboard/lib/format'
import type { Invoice, InvoiceStatus } from '../../types/settings-types'

const STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
  paid: 'positive',
  unpaid: 'warning',
  overdue: 'critical',
}

export function InvoicesView({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card>
      <CardHeader title="Invoices" description="Download invoices for your records or for expense reporting." />
      {invoices.length === 0 ? (
        <p className="text-sm text-muted">No invoices yet.</p>
      ) : (
        <div className="divide-y divide-line">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink">{invoice.number}</p>
                <p className="mt-0.5 text-xs text-muted">
                  Issued {formatDate(invoice.issuedDate)} · Due {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-ink">{formatAmount(invoice.amount, invoice.currency)}</p>
                <Badge tone={STATUS_TONE[invoice.status]}>{invoice.status[0].toUpperCase() + invoice.status.slice(1)}</Badge>
                <button
                  type="button"
                  disabled
                  title="Invoice downloads aren't available yet"
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
