import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import { PAYROLL_RUN_STATUS_META } from '../../lib/status-meta'
import type { PayrollRunMeta } from '../../types/payroll-types'

export function UpcomingPayrollCard({ runs }: { runs: PayrollRunMeta[] }) {
  if (runs.length === 0) {
    return (
      <Card>
        <CardHeader title="Upcoming payroll" />
        <p className="text-sm text-muted">No payroll runs scheduled yet.</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title="Upcoming payroll" />
      <ul className="divide-y divide-line">
        {runs.map((run) => {
          const statusMeta = PAYROLL_RUN_STATUS_META[run.status]
          return (
            <li key={run.id} className="py-2.5 first:pt-0 last:pb-0">
              <Link to={`/payroll/runs/${run.id}`} className="flex items-center justify-between gap-3 hover:opacity-80">
                <div>
                  <p className="text-sm font-medium text-ink">{run.periodLabel}</p>
                  <p className="text-xs text-muted">{formatDate(run.payDate)}</p>
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
