import { RBAC_MATRIX, ROLE_DEFINITIONS } from '../data/rbac'
import { INVITATIONS } from '../data/invitations'
import { TEAM_MEMBERS } from '../data/team-members'
import { getManagers } from '../lib/managers'
import type { Invitation, ManagerInfo, ModulePermission, RoleDefinition, TeamMember } from '../types/team-access-types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const mockTeamAccessApi = {
  async getTeamMembers(): Promise<TeamMember[]> {
    await delay(300)
    return TEAM_MEMBERS
  },

  async getInvitations(): Promise<Invitation[]> {
    await delay(300)
    return INVITATIONS
  },

  async getManagers(): Promise<ManagerInfo[]> {
    await delay(300)
    return getManagers()
  },

  async getRoleDefinitions(): Promise<RoleDefinition[]> {
    await delay(200)
    return ROLE_DEFINITIONS
  },

  async getPermissionMatrix(): Promise<ModulePermission[]> {
    await delay(200)
    return RBAC_MATRIX
  },
}
