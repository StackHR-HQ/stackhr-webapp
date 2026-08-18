import { http } from '../../../lib/http'
import type { Invitation, ManagerInfo, ModulePermission, RoleDefinition, TeamMember } from '../types/team-access-types'

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as team-access-mock-api.ts so team-access-service.ts
// can swap to this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const teamAccessApi = {
  async getTeamMembers(): Promise<TeamMember[]> {
    const { data } = await http.get<TeamMember[]>('/settings/team-members')
    return data
  },

  async getInvitations(): Promise<Invitation[]> {
    const { data } = await http.get<Invitation[]>('/settings/invitations')
    return data
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
