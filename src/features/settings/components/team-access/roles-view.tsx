import { CheckIcon } from '@phosphor-icons/react'
import { Badge } from '../../../../components/ui/badge'
import { Card } from '../../../../components/ui/card'
import { ROLE_META } from '../../lib/status-meta'
import type { RoleDefinition, TeamMember } from '../../types/team-access-types'

export function RolesView({ roles, members }: { roles: RoleDefinition[]; members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {roles.map((role) => {
        const meta = ROLE_META[role.role]
        const count = members.filter((member) => member.role === role.role && member.status === 'active').length

        return (
          <Card key={role.role}>
            <div className="flex items-center justify-between gap-2">
              <Badge tone={meta.tone}>{meta.label}</Badge>
              <span className="text-xs text-muted">
                {count} member{count === 1 ? '' : 's'}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">{role.description}</p>
            <ul className="mt-4 space-y-2">
              {role.summary.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-ink">
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                  {line}
                </li>
              ))}
            </ul>
          </Card>
        )
      })}
    </div>
  )
}
