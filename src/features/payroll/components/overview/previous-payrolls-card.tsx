import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import { PAYROLL_RUN_STATUS_META } from '../../lib/status-meta'
import type { PayrollRunMeta } from '../../types/payroll-types'

export function PreviousPayrollsCard({ runs }: { runs: PayrollRunMeta[] }) {
  return (
    <Card>
      <CardHeader
        title="Previous payrolls"
        action={
          <Link to="/payroll/runs" className="text-xs font-medium text-accent hover:underline">
            View all runs →
          </Link>
        }
      />

      <ul className="divide-y divide-line">
        {runs.map((run) => {
          const statusMeta = PAYROLL_RUN_STATUS_META[run.status]
          return (
            <li key={run.id} className="py-2.5 first:pt-0 last:pb-0">
              <Link to={`/payroll/runs/${run.id}`} className="flex items-center justify-between gap-3 hover:opacity-80">
                <div>
                  <p className="text-sm font-medium text-ink">{run.periodLabel}</p>
                  <p className="text-xs text-muted">Paid {formatDate(run.payDate)}</p>
                </div>
                <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
              </Link>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
