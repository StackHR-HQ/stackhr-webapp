import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import { payrollStatusMeta } from '../../lib/status-meta'
import type { UpcomingPayrollRun } from '../../types/dashboard-types'

export function UpcomingPayrollCard({ runs }: { runs: UpcomingPayrollRun[] }) {
  return (
    <Card>
      <CardHeader title="Upcoming payroll" />

      {runs.length > 0 ? (
        <ul className="divide-y divide-line">
          {runs.map((run) => {
            const statusMeta = payrollStatusMeta(run.status)
            return (
              <li key={run.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{run.periodLabel}</p>
                  <p className="truncate text-xs text-muted">
                    {run.payDate ? `${run.title} · Pays ${formatDate(run.payDate)}` : run.title}
                  </p>
                </div>
                <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="py-4 text-center text-sm text-muted">No open payroll runs.</p>
      )}

      <Link to="/payroll/runs" className="mt-4 inline-block text-xs font-medium text-accent hover:underline">
        View all payroll runs →
      </Link>
    </Card>
  )
}
