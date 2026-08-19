import type { AuthUser } from '../../auth/types/auth-types'

export type Role = AuthUser['role']

export type AccessStatus = 'active' | 'suspended'

export interface TeamMember {
  id: string
  employeeId: string
  fullName: string
  avatarInitials: string
  email: string
  jobTitle: string
  role: Role
  status: AccessStatus
  invitedAt: string
  lastActiveAt?: string
}

export type InvitationStatus = 'pending' | 'expired'

export interface Invitation {
  id: string
  email: string
  fullName: string
  role: Role
  invitedBy: string
  invitedAt: string
  status: InvitationStatus
}

export interface ManagerInfo {
  employeeId: string
  fullName: string
  avatarInitials: string
  jobTitle: string
  directReportCount: number
  hasAccess: boolean
  role?: Role
}

export type PermissionLevel = 'full' | 'team' | 'own' | 'none'

export interface ModulePermission {
  module: string
  label: string
  description: string
  admin: PermissionLevel
  manager: PermissionLevel
  employee: PermissionLevel
}

export interface RoleDefinition {
  role: Role
  label: string
  description: string
  summary: string[]
}
