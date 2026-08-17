import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount, formatDate } from '../../lib/format'
import { PAYROLL_RUN_STATUS_META } from '../../lib/status-meta'
import type { PayrollRunDetail } from '../../types/payroll-types'

export function CurrentPayrollCard({ run }: { run: PayrollRunDetail }) {
  const statusMeta = PAYROLL_RUN_STATUS_META[run.status]

  return (
    <Card>
      <CardHeader
        title="Current payroll"
        description={run.periodLabel}
        action={<Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-muted">Pay date</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{formatDate(run.payDate)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Gross pay</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{formatAmount(run.summary.grossPay, run.summary.currency)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Net pay</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{formatAmount(run.summary.netPay, run.summary.currency)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Employees</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{run.summary.employeeCount}</p>
        </div>
      </div>

      {run.status === 'pending_approval' ? (
        <p className="mt-4 rounded-lg border border-line bg-canvas px-3 py-2 text-xs text-muted">
          Calculation and compliance checks are complete — this run is waiting on your approval before payslips go out.
        </p>
      ) : null}

      <Link to={`/payroll/runs/${run.id}`} className="mt-4 inline-block text-xs font-medium text-accent hover:underline">
        {run.status === 'pending_approval' ? 'Review and approve →' : 'View run details →'}
      </Link>
    </Card>
  )
}
