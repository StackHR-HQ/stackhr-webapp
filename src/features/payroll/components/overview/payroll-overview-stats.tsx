import { CalendarCheckIcon, HandCoinsIcon, ReceiptIcon, UsersThreeIcon, type Icon } from '@phosphor-icons/react'
import { formatAmount, formatDate } from '../../lib/format'
import type { PayrollRunSummary } from '../../types/payroll-types'

function StatTile({ icon: TileIcon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <div className="rounded-panel border border-line bg-surface p-4 shadow-panel">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
        <TileIcon className="h-4.5 w-4.5 text-ink" />
      </div>
      <div className="mt-3">
        <p className="text-xl font-medium text-ink">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  )
}

export function PayrollOverviewStats({ summary, nextPayDate }: { summary: PayrollRunSummary; nextPayDate: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatTile
        icon={HandCoinsIcon}
        label="Total payroll cost"
        value={formatAmount(summary.totalEmployerCost, summary.currency)}
      />
      <StatTile
        icon={ReceiptIcon}
        label="Employee deductions"
        value={formatAmount(summary.totalEmployeeDeductions, summary.currency)}
      />
      <StatTile
        icon={UsersThreeIcon}
        label="Employer contributions"
        value={formatAmount(summary.totalEmployerContributions, summary.currency)}
      />
      <StatTile icon={CalendarCheckIcon} label="Next pay date" value={formatDate(nextPayDate)} />
    </div>
  )
}
