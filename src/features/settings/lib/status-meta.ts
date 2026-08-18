import type { BadgeTone } from '../../../components/ui/badge'
import type { AccessStatus, InvitationStatus, PermissionLevel, Role } from '../types/team-access-types'

export const ROLE_META: Record<Role, { label: string; tone: BadgeTone }> = {
  admin: { label: 'Admin', tone: 'critical' },
  manager: { label: 'Manager', tone: 'accent' },
  employee: { label: 'Employee', tone: 'neutral' },
}

export const ACCESS_STATUS_META: Record<AccessStatus, { label: string; tone: BadgeTone }> = {
  active: { label: 'Active', tone: 'positive' },
  suspended: { label: 'Suspended', tone: 'critical' },
}

export const INVITATION_STATUS_META: Record<InvitationStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending', tone: 'warning' },
  expired: { label: 'Expired', tone: 'neutral' },
}

export const PERMISSION_LEVEL_META: Record<PermissionLevel, { label: string; tone: BadgeTone }> = {
  full: { label: 'Full access', tone: 'positive' },
  team: { label: 'Team only', tone: 'accent' },
  own: { label: 'Own records only', tone: 'warning' },
  none: { label: 'No access', tone: 'neutral' },
}
