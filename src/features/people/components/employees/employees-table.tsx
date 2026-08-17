import { useNavigate } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatDate } from '../../lib/format'
import { EMPLOYMENT_STATUS_META } from '../../lib/status-meta'
import type { Department, EmployeeSummary } from '../../types/people-types'

export function EmployeesTable({
  employees,
  departments,
}: {
  employees: EmployeeSummary[]
  departments: Department[]
}) {
  const navigate = useNavigate()

  function departmentName(id: string): string {
    return departments.find((department) => department.id === id)?.name ?? '—'
  }

  if (employees.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No employees match your filters.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">Job title</th>
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Start date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {employees.map((employee) => {
            const statusMeta = EMPLOYMENT_STATUS_META[employee.employmentStatus]
            return (
              <tr
                key={employee.id}
                onClick={() => navigate(`/people/employees/${employee.id}`)}
                className="cursor-pointer bg-canvas transition-colors hover:bg-surface"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={employee.avatarInitials} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{employee.fullName}</p>
                      <p className="truncate text-xs text-muted">{employee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink">{employee.jobTitle}</td>
                <td className="px-4 py-3 text-ink">{departmentName(employee.departmentId)}</td>
                <td className="px-4 py-3 text-muted">{employee.employmentType}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(employee.startDate)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
