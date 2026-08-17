import { Avatar } from '../../../../components/ui/avatar'
import { formatAmount } from '../../lib/format'
import type { RunEmployeeLine } from '../../types/payroll-types'

export function EarningsTab({ lines, currency }: { lines: RunEmployeeLine[]; currency: string }) {
  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Basic</th>
            <th className="px-4 py-3 font-medium">Housing</th>
            <th className="px-4 py-3 font-medium">Transport</th>
            <th className="px-4 py-3 font-medium">Other allowances</th>
            <th className="px-4 py-3 font-medium">Gross pay</th>
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
              <td className="px-4 py-3 text-muted">{formatAmount(line.basic, currency)}</td>
              <td className="px-4 py-3 text-muted">{formatAmount(line.housing, currency)}</td>
              <td className="px-4 py-3 text-muted">{formatAmount(line.transport, currency)}</td>
              <td className="px-4 py-3 text-muted">{formatAmount(line.otherAllowances, currency)}</td>
              <td className="px-4 py-3 text-ink">{formatAmount(line.grossPay, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
