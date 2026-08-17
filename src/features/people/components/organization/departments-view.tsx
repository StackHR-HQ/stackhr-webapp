import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Card } from '../../../../components/ui/card'
import type { Department, EmployeeSummary } from '../../types/people-types'
import { AvatarStack } from './avatar-stack'

export function DepartmentsView({ departments, employees }: { departments: Department[]; employees: EmployeeSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {departments.map((department) => {
        const members = employees.filter((employee) => employee.departmentId === department.id)
        const head = employees.find((employee) => employee.id === department.headEmployeeId)

        return (
          <Card key={department.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-ink">{department.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {members.length} member{members.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {head ? (
              <Link
                to={`/people/employees/${head.id}`}
                className="mt-4 flex items-center gap-2.5 rounded-lg border border-line bg-canvas p-2.5 hover:bg-surface-2"
              >
                <Avatar initials={head.avatarInitials} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-xs text-muted">Department head</span>
                  <span className="block truncate text-sm font-medium text-ink">{head.fullName}</span>
                </span>
              </Link>
            ) : null}

            <div className="mt-4">
              <AvatarStack members={members} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
