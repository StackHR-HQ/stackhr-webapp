import { FileTextIcon } from '@phosphor-icons/react'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatAmount } from '../../lib/format'
import type { PayrollRunStatus, RunEmployeeLine } from '../../types/payroll-types'

export function PayslipsTab({
  lines,
  currency,
  runStatus,
}: {
  lines: RunEmployeeLine[]
  currency: string
  runStatus: PayrollRunStatus
}) {
  const generated = runStatus === 'completed'

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Net pay</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {lines.map((line) => (
            <tr key={line.employeeId} className="bg-canvas">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={line.avatarInitials} size="sm" />
                  <span className="font-medium text-ink">{line.employeeName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-ink">{formatAmount(line.netPay, currency)}</td>
              <td className="px-4 py-3">
                <Badge tone={generated ? 'positive' : 'neutral'}>{generated ? 'Generated' : 'Pending'}</Badge>
              </td>
              <td className="px-4 py-3 text-right">
                {generated ? <FileTextIcon className="ml-auto h-4 w-4 text-muted" aria-hidden /> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
