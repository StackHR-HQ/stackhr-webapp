import { useNavigate } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount, formatDate } from '../../lib/format'
import { PAYROLL_RUN_STATUS_META } from '../../lib/status-meta'
import type { PayrollRunListItem } from '../../types/payroll-types'

export function RunsTable({ runs }: { runs: PayrollRunListItem[] }) {
  const navigate = useNavigate()

  if (runs.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No payroll runs match this filter.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Period</th>
            <th className="px-4 py-3 font-medium">Pay date</th>
            <th className="px-4 py-3 font-medium">Employees</th>
            <th className="px-4 py-3 font-medium">Gross pay</th>
            <th className="px-4 py-3 font-medium">Net pay</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {runs.map((run) => {
            const statusMeta = PAYROLL_RUN_STATUS_META[run.status]
            return (
              <tr
                key={run.id}
                onClick={() => navigate(`/payroll/runs/${run.id}`)}
                className="cursor-pointer bg-canvas transition-colors hover:bg-surface"
              >
                <td className="px-4 py-3 font-medium text-ink">{run.periodLabel}</td>
                <td className="px-4 py-3 text-muted">{formatDate(run.payDate)}</td>
                <td className="px-4 py-3 text-ink">{run.summary.employeeCount}</td>
                <td className="px-4 py-3 text-ink">{formatAmount(run.summary.grossPay, run.summary.currency)}</td>
                <td className="px-4 py-3 text-ink">{formatAmount(run.summary.netPay, run.summary.currency)}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
