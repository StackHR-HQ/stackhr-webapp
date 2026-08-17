import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { formatAmount } from '../../lib/format'
import type { RunEmployeeLine } from '../../types/payroll-types'

export function EmployeesTab({ lines, currency }: { lines: RunEmployeeLine[]; currency: string }) {
  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Gross pay</th>
            <th className="px-4 py-3 font-medium">Deductions</th>
            <th className="px-4 py-3 font-medium">Net pay</th>
            <th className="px-4 py-3 font-medium">Employer cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {lines.map((line) => (
            <tr key={line.employeeId} className="bg-canvas">
              <td className="px-4 py-3">
                <Link to={`/people/employees/${line.employeeId}`} className="flex items-center gap-2.5 hover:underline">
                  <Avatar initials={line.avatarInitials} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{line.employeeName}</p>
                    <p className="truncate text-xs text-muted">{line.jobTitle}</p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3 text-ink">{formatAmount(line.grossPay, currency)}</td>
              <td className="px-4 py-3 text-muted">{formatAmount(line.totalDeductions, currency)}</td>
              <td className="px-4 py-3 text-ink">{formatAmount(line.netPay, currency)}</td>
              <td className="px-4 py-3 text-muted">{formatAmount(line.employerCost, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
