import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { tenureLabel } from '../../lib/dates'
import { formatDate } from '../../lib/format'
import { EMPLOYMENT_STATUS_META } from '../../lib/status-meta'
import type { Department, EmployeeDetail, EmployeeSummary } from '../../types/people-types'
import { FieldGrid } from './field-grid'

export function EmploymentTab({
  employee,
  department,
  manager,
  directReports,
}: {
  employee: EmployeeDetail
  department?: Department
  manager?: EmployeeSummary
  directReports: EmployeeSummary[]
}) {
  const statusMeta = EMPLOYMENT_STATUS_META[employee.employmentStatus]

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader title="Employment details" />
        <FieldGrid
          fields={[
            { label: 'Job title', value: employee.jobTitle },
            { label: 'Department', value: department?.name ?? '—' },
            {
              label: 'Manager',
              value: manager ? (
                <Link to={`/people/employees/${manager.id}`} className="text-accent hover:underline">
                  {manager.fullName}
                </Link>
              ) : (
                '—'
              ),
            },
            { label: 'Employment type', value: employee.employmentType },
            { label: 'Status', value: <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge> },
            { label: 'Start date', value: formatDate(employee.startDate) },
            { label: 'Tenure', value: tenureLabel(employee.startDate) },
            { label: 'Work location', value: employee.workLocation },
          ]}
        />
      </Card>

      <Card>
        <CardHeader title="Direct reports" description={`${directReports.length} people report to ${employee.fullName}`} />
        {directReports.length > 0 ? (
          <ul className="space-y-1">
            {directReports.map((report) => (
              <li key={report.id}>
                <Link
                  to={`/people/employees/${report.id}`}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-canvas"
                >
                  <Avatar initials={report.avatarInitials} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{report.fullName}</span>
                    <span className="block truncate text-xs text-muted">{report.jobTitle}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No direct reports.</p>
        )}
      </Card>
    </div>
  )
}
