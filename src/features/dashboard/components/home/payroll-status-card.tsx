import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatDate } from '../../lib/format'
import { PAYROLL_STATUS_META } from '../../lib/status-meta'
import type { PayrollStatusSummary } from '../../types/dashboard-types'

export function PayrollStatusCard({ payroll }: { payroll: PayrollStatusSummary }) {
  const statusMeta = PAYROLL_STATUS_META[payroll.status]
  const progressPercent = Math.round((payroll.employeesIncluded / payroll.employeesTotal) * 100)

  return (
    <Card>
      <CardHeader
        title="Payroll status"
        description={payroll.periodLabel}
        action={<Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted">Pay date</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{formatDate(payroll.payDate)}</p>
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
