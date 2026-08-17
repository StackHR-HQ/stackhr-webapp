import { Avatar } from '../../../../components/ui/avatar'
import type { EmployeeSummary } from '../../types/people-types'

export function AvatarStack({ members, max = 5 }: { members: EmployeeSummary[]; max?: number }) {
  const visible = members.slice(0, max)
  const overflow = members.length - visible.length

  return (
    <div className="flex -space-x-2">
      {visible.map((member) => (
        <Avatar
          key={member.id}
          initials={member.avatarInitials}
          size="sm"
          className="border-2 border-surface"
        />
      ))}
      {overflow > 0 ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-surface-2 text-xs font-medium text-muted">
          +{overflow}
        </span>
      ) : null}
    </div>
  )
}
