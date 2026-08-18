import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { ROLE_META } from '../../lib/status-meta'
import type { ManagerInfo } from '../../types/team-access-types'

export function ManagersView({ managers }: { managers: ManagerInfo[] }) {
  if (managers.length === 0) {
    return (
      <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
        No one has direct reports yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Manager</th>
            <th className="px-4 py-3 font-medium">Direct reports</th>
            <th className="px-4 py-3 font-medium">StackHR access</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {managers.map((manager) => (
            <tr key={manager.employeeId} className="bg-canvas">
              <td className="px-4 py-3">
                <Link
                  to={`/people/employees/${manager.employeeId}`}
                  className="flex items-center gap-2.5 hover:underline"
                >
                  <Avatar initials={manager.avatarInitials} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{manager.fullName}</p>
                    <p className="truncate text-xs text-muted">{manager.jobTitle}</p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3 text-ink">{manager.directReportCount}</td>
              <td className="px-4 py-3">
                {manager.hasAccess && manager.role ? (
                  <Badge tone={ROLE_META[manager.role].tone}>{ROLE_META[manager.role].label}</Badge>
                ) : (
                  <span className="text-xs text-muted">No StackHR access yet</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
