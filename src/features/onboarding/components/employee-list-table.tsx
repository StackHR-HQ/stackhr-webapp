import { formatSalary, getManagerLabel } from '../lib/employee-helpers'
import type { EmployeeDraft } from '../types/onboarding-types'

export function EmployeeListTable({
  employees,
  currency,
  onRemove,
}: {
  employees: EmployeeDraft[]
  currency: string
  onRemove?: (id: string) => void
}) {
  if (employees.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-6 text-center text-sm text-muted">
        No employees added yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Salary</th>
            <th className="px-4 py-3 font-medium">Manager</th>
            {onRemove ? <th className="px-4 py-3" /> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{employee.fullName}</p>
                <p className="text-xs text-muted">{employee.email}</p>
              </td>
              <td className="px-4 py-3 text-ink">{employee.jobTitle}</td>
              <td className="px-4 py-3 text-ink">{employee.department}</td>
              <td className="px-4 py-3 text-ink">{formatSalary(employee.salary, currency)}</td>
              <td className="px-4 py-3 text-muted">{getManagerLabel(employee, employees)}</td>
              {onRemove ? (
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(employee.id)}
                    className="text-xs text-critical hover:underline"
                  >
                    Remove
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
