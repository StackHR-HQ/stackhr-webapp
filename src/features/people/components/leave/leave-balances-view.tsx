import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import type { EmployeeLeaveBalanceRow } from '../../types/people-types'

export function LeaveBalancesView({ rows }: { rows: EmployeeLeaveBalanceRow[] }) {
  const balanceTypes = rows[0]?.balances.map((balance) => balance.type) ?? []

  if (rows.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No leave balances to show.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            {balanceTypes.map((type) => (
              <th key={type} className="px-4 py-3 font-medium">
                {type}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.employeeId} className="bg-canvas">
              <td className="px-4 py-3">
                <Link to={`/people/employees/${row.employeeId}`} className="flex items-center gap-2.5 hover:underline">
                  <Avatar initials={row.avatarInitials} size="sm" />
                  <span className="font-medium text-ink">{row.employeeName}</span>
                </Link>
              </td>
              {row.balances.map((balance) => (
                <td key={balance.type} className="px-4 py-3 text-ink">
                  {balance.totalDays - balance.usedDays}
                  <span className="text-muted"> / {balance.totalDays} left</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
