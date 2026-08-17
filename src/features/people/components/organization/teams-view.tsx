import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Card } from '../../../../components/ui/card'
import type { EmployeeSummary, Team } from '../../types/people-types'
import { AvatarStack } from './avatar-stack'

export function TeamsView({ teams, employees }: { teams: Team[]; employees: EmployeeSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {teams.map((team) => {
        const members = employees.filter((employee) => team.memberIds.includes(employee.id))
        const lead = employees.find((employee) => employee.id === team.leadEmployeeId)

        return (
          <Card key={team.id}>
            <p className="text-sm font-medium text-ink">{team.name}</p>
            <p className="mt-0.5 text-xs text-muted">{team.description}</p>

            {lead ? (
              <Link
                to={`/people/employees/${lead.id}`}
                className="mt-4 flex items-center gap-2.5 rounded-lg border border-line bg-canvas p-2.5 hover:bg-surface-2"
              >
                <Avatar initials={lead.avatarInitials} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-xs text-muted">Team lead</span>
                  <span className="block truncate text-sm font-medium text-ink">{lead.fullName}</span>
                </span>
              </Link>
            ) : null}

            <div className="mt-4 flex items-center justify-between">
              <AvatarStack members={members} />
              <span className="text-xs text-muted">
                {members.length} member{members.length === 1 ? '' : 's'}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
