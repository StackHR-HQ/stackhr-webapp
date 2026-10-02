import { MoneyIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount } from '../../lib/format'
import { payrollStatusMeta } from '../../lib/status-meta'
import type { PayrollStatusSummary } from '../../types/dashboard-types'

export function PayrollStatusCard({ payroll }: { payroll: PayrollStatusSummary | null }) {
  if (!payroll) {
    return (
      <Card>
        <CardHeader title="Payroll status" />
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <MoneyIcon className="h-5 w-5 text-muted" />
          <p className="text-sm text-muted">No payroll runs yet.</p>
        </div>
        <Link to="/payroll/runs" className="mt-4 inline-block text-xs font-medium text-accent hover:underline">
          Go to payroll runs →
        </Link>
      </Card>
    )
  }

  const statusMeta = payrollStatusMeta(payroll.status)
  const progressPercent = payroll.employeesTotal
    ? Math.min(100, Math.round((payroll.employeesIncluded / payroll.employeesTotal) * 100))
    : 0

  return (
    <Card>
      <CardHeader
        title="Payroll status"
        description={payroll.title}
        action={<Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-muted">Period</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{payroll.periodLabel}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Gross pay</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{formatAmount(payroll.totalGross, payroll.currency)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Net pay</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{formatAmount(payroll.totalNet, payroll.currency)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Employees</p>
          <p className="mt-0.5 text-sm font-medium text-ink">
            {payroll.employeesIncluded} / {payroll.employeesTotal}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
          <div className="h-full rounded-pill bg-accent transition-[width]" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <Link to="/payroll/overview" className="mt-4 inline-block text-xs font-medium text-accent hover:underline">
        View payroll overview →
      </Link>
    </Card>
  )
}
