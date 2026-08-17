import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { formatAmount } from '../../lib/format'
import type { EmployeeSalaryRow } from '../../types/payroll-types'

export function EmployeeSalariesView({ rows }: { rows: EmployeeSalaryRow[] }) {
  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Annual salary</th>
            <th className="px-4 py-3 font-medium">Monthly salary</th>
            <th className="px-4 py-3 font-medium">Pay frequency</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.employeeId} className="bg-canvas">
              <td className="px-4 py-3">
                <Link to={`/people/employees/${row.employeeId}`} className="flex items-center gap-2.5 hover:underline">
                  <Avatar initials={row.avatarInitials} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{row.employeeName}</p>
                    <p className="truncate text-xs text-muted">{row.jobTitle}</p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3 text-ink">{formatAmount(row.annualSalary, row.currency)}</td>
              <td className="px-4 py-3 text-muted">{formatAmount(row.monthlySalary, row.currency)}</td>
              <td className="px-4 py-3 text-muted">{row.payFrequency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
