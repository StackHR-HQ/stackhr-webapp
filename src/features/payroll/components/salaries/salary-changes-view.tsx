import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { formatAmount, formatDate } from '../../lib/format'
import type { SalaryChangeEntry } from '../../types/payroll-types'

export function SalaryChangesView({ changes }: { changes: SalaryChangeEntry[] }) {
  if (changes.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No salary changes on record.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Previous salary</th>
            <th className="px-4 py-3 font-medium">New salary</th>
            <th className="px-4 py-3 font-medium">Change</th>
            <th className="px-4 py-3 font-medium">Effective date</th>
            <th className="px-4 py-3 font-medium">Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {changes.map((change) => {
            const percentChange = ((change.newSalary - change.previousSalary) / change.previousSalary) * 100
            return (
              <tr key={change.id} className="bg-canvas">
                <td className="px-4 py-3">
                  <Link
                    to={`/people/employees/${change.employeeId}`}
                    className="flex items-center gap-2.5 hover:underline"
                  >
                    <Avatar initials={change.avatarInitials} size="sm" />
                    <span className="font-medium text-ink">{change.employeeName}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{formatAmount(change.previousSalary, change.currency)}</td>
                <td className="px-4 py-3 text-ink">{formatAmount(change.newSalary, change.currency)}</td>
                <td className="px-4 py-3 text-positive">+{percentChange.toFixed(1)}%</td>
                <td className="px-4 py-3 text-muted">{formatDate(change.effectiveDate)}</td>
                <td className="px-4 py-3 text-muted">{change.reason}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
