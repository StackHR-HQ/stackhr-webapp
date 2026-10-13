import { http } from '../../../lib/http'
import { toUiRole } from '../../auth/api/auth-api'
import type { Invitation, ManagerInfo, ModulePermission, Role, RoleDefinition, TeamMember } from '../types/team-access-types'

// Workspace invitations, which carry the person's access role. Accepted and
// revoked ones are left out of the Invitations tab.
interface ApiInvitation {
  id: string
  email: string
  role: string
  status: string
  createdAt: string
  lastSentAt: string | null
  expiresAt: string
  // The person who sent the invitation.
  user: { id: string; name: string; email: string } | null
}

const API_ROLE: Record<Role, string> = {
  admin: 'BUSINESS_ADMIN',
  manager: 'MANAGER',
  employee: 'EMPLOYEE',
}

function toInvitation(invitation: ApiInvitation): Invitation {
  const expired = invitation.status === 'expired' || new Date(invitation.expiresAt) < new Date()
  return {
    id: invitation.id,
    email: invitation.email,
    role: toUiRole(invitation.role),
    invitedBy: invitation.user?.name ?? '—',
    invitedAt: invitation.lastSentAt ?? invitation.createdAt,
    status: expired ? 'expired' : 'pending',
  }
}

// Team members, managers, roles and permissions have no backend endpoints
// yet; team-access-service.ts keeps those on mock data.
export const teamAccessApi = {
  async getTeamMembers(): Promise<TeamMember[]> {
    const { data } = await http.get<TeamMember[]>('/settings/team-members')
    return data
  },

  async getInvitations(): Promise<Invitation[]> {
    const { data } = await http.get<{ invitations: ApiInvitation[] }>('/invitations')
    return data.invitations
      .filter((invitation) => invitation.status === 'pending' || invitation.status === 'expired')
      .map(toInvitation)
      .sort((a, b) => b.invitedAt.localeCompare(a.invitedAt))
  },

  // The backend emails the invitee a link to /accept-invitation?invitationId=<id>.
  async inviteMember({ email, role }: { email: string; role: Role }): Promise<void> {
    await http.post('/invitations', { email, role: API_ROLE[role] })
  },

  async resendInvitation(id: string): Promise<void> {
    await http.post(`/invitations/${id}/resend`)
  },

  async revokeInvitation(id: string): Promise<void> {
    await http.delete(`/invitations/${id}`)
  },

  async getManagers(): Promise<ManagerInfo[]> {
    const { data } = await http.get<ManagerInfo[]>('/settings/managers')
    return data
  },

  async getRoleDefinitions(): Promise<RoleDefinition[]> {
    const { data } = await http.get<RoleDefinition[]>('/settings/roles')
    return data
  },

  async getPermissionMatrix(): Promise<ModulePermission[]> {
    const { data } = await http.get<ModulePermission[]>('/settings/permissions')
    return data
  },
}
