import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate, formatDaysUntil } from '../../lib/format'
import { PAYROLL_STATUS_META } from '../../lib/status-meta'
import type { UpcomingPayrollRun } from '../../types/dashboard-types'

export function UpcomingPayrollCard({ runs }: { runs: UpcomingPayrollRun[] }) {
  return (
    <Card>
      <CardHeader title="Upcoming payroll" />

      <ul className="divide-y divide-line">
        {runs.map((run) => {
          const statusMeta = PAYROLL_STATUS_META[run.status]
          return (
            <li key={run.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink">{run.periodLabel}</p>
                <p className="text-xs text-muted">
                  {formatDate(run.payDate)} · {formatDaysUntil(run.payDate)}
                </p>
              </div>
              <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
            </li>
          )
        })}
      </ul>

      <Link to="/payroll/runs" className="mt-4 inline-block text-xs font-medium text-accent hover:underline">
        View all payroll runs →
      </Link>
    </Card>
  )
}
