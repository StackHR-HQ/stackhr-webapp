import { PencilSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Card, CardHeader } from '../../../../components/ui/card'
import { Modal } from '../../../../components/ui/modal'
import { tenureLabel } from '../../lib/dates'
import { formatDate } from '../../lib/format'
import { EMPLOYMENT_STATUS_META } from '../../lib/status-meta'
import type { Department, EmployeeDetail, EmployeeSummary } from '../../types/people-types'
import { EditEmploymentForm } from './edit-employment-form'
import { FieldGrid } from './field-grid'

export function EmploymentTab({
  employee,
  department,
  manager,
  directReports,
  employees,
}: {
  employee: EmployeeDetail
  department?: Department
  manager?: EmployeeSummary
  directReports: EmployeeSummary[]
  employees: EmployeeSummary[]
}) {
  const statusMeta = EMPLOYMENT_STATUS_META[employee.employmentStatus]
  const [editing, setEditing] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader
          title="Employment details"
          action={
            <Button variant="secondary" width="fit" className="gap-1.5 px-3 py-1.5" onClick={() => setEditing(true)}>
              <PencilSimpleIcon className="h-3.5 w-3.5" />
              Edit
            </Button>
          }
        />
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
            { label: 'Work location', value: employee.workLocation || '—' },
          ]}
        />
      </Card>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit employment">
        <EditEmploymentForm employee={employee} employees={employees} onDone={() => setEditing(false)} />
      </Modal>

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
