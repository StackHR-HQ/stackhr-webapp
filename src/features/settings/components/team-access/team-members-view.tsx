import { useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Badge } from '../../../../components/ui/badge'
import { formatDate, formatRelativeTime } from '../../lib/format'
import { ACCESS_STATUS_META, ROLE_META } from '../../lib/status-meta'
import type { Role, TeamMember } from '../../types/team-access-types'

const ROLE_OPTIONS: Role[] = ['admin', 'manager', 'employee']

export function TeamMembersView({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [members, setMembers] = useState(initialMembers)

  function changeRole(id: string, role: Role) {
    setMembers((prev) => prev.map((member) => (member.id === id ? { ...member, role } : member)))
  }

  function toggleStatus(id: string) {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, status: member.status === 'active' ? 'suspended' : 'active' } : member,
      ),
    )
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Team member</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Invited</th>
            <th className="px-4 py-3 font-medium">Last active</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {members.map((member) => {
            const statusMeta = ACCESS_STATUS_META[member.status]
            return (
              <tr key={member.id} className="bg-canvas">
                <td className="px-4 py-3">
                  <Link
                    to={`/people/employees/${member.employeeId}`}
                    className="flex items-center gap-2.5 hover:underline"
                  >
                    <Avatar initials={member.avatarInitials} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{member.fullName}</p>
                      <p className="truncate text-xs text-muted">{member.jobTitle}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={member.role}
                    onChange={(event) => changeRole(member.id, event.target.value as Role)}
                    className="rounded-lg border border-line bg-canvas px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_META[role].label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(member.invitedAt)}</td>
                <td className="px-4 py-3 text-muted">
                  {member.lastActiveAt ? formatRelativeTime(member.lastActiveAt) : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleStatus(member.id)}
                    className={`text-xs font-medium hover:underline ${
                      member.status === 'active' ? 'text-critical' : 'text-accent'
                    }`}
                  >
                    {member.status === 'active' ? 'Revoke access' : 'Restore access'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
