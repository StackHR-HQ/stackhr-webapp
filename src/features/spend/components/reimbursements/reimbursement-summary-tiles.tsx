import { CheckCircleIcon, ClockIcon, HandCoinsIcon, type Icon } from '@phosphor-icons/react'
import { formatAmount } from '../../lib/format'
import type { ReimbursementSummary, ReimbursementTotals } from '../../types/spend-types'

function SummaryTile({ icon: TileIcon, label, totals }: { icon: Icon; label: string; totals: ReimbursementTotals }) {
  return (
    <div className="rounded-panel border border-line bg-surface p-4 shadow-panel">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
        <TileIcon className="h-4.5 w-4.5 text-ink" />
      </div>
      <div className="mt-3">
        <p className="text-xl font-medium text-ink">
          {totals.amounts.length === 0
            ? formatAmount(0, 'NGN')
            : totals.amounts.map(({ currency, amount }) => formatAmount(amount, currency)).join(' + ')}
        </p>
        <p className="text-xs text-muted">
          {label} · {totals.count} {totals.count === 1 ? 'claim' : 'claims'}
        </p>
      </div>
    </div>
  )
}

export function ReimbursementSummaryTiles({ summary }: { summary: ReimbursementSummary }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryTile icon={ClockIcon} label="Awaiting approval" totals={summary.pending} />
      <SummaryTile icon={HandCoinsIcon} label="Approved, not yet paid" totals={summary.approved} />
      <SummaryTile icon={CheckCircleIcon} label="Paid" totals={summary.paid} />
    </div>
  )
}
