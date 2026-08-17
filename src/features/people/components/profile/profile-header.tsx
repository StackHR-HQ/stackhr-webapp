import { EnvelopeIcon, MapPinIcon } from '@phosphor-icons/react'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { tenureLabel } from '../../lib/dates'
import { EMPLOYMENT_STATUS_META } from '../../lib/status-meta'
import type { Department, EmployeeDetail } from '../../types/people-types'

export function ProfileHeader({ employee, department }: { employee: EmployeeDetail; department?: Department }) {
  const statusMeta = EMPLOYMENT_STATUS_META[employee.employmentStatus]

  return (
    <div className="rounded-panel border border-line bg-surface p-5 shadow-panel">
      <div className="flex flex-wrap items-start gap-4">
        <Avatar initials={employee.avatarInitials} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-medium text-ink">{employee.fullName}</h1>
            <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted">
            {employee.jobTitle} · {department?.name ?? '—'}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <EnvelopeIcon className="h-3.5 w-3.5" />
              {employee.email}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="h-3.5 w-3.5" />
              {employee.workLocation}
            </span>
            <span>Tenure: {tenureLabel(employee.startDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
