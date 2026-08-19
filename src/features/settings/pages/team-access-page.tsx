import { useState } from 'react'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { InvitationsView } from '../components/team-access/invitations-view'
import { ManagersView } from '../components/team-access/managers-view'
import { PermissionsView } from '../components/team-access/permissions-view'
import { RolesView } from '../components/team-access/roles-view'
import { TeamMembersView } from '../components/team-access/team-members-view'
import { useInvitations } from '../hooks/use-invitations'
import { useManagers } from '../hooks/use-managers'
import { usePermissionMatrix } from '../hooks/use-permission-matrix'
import { useRoleDefinitions } from '../hooks/use-role-definitions'
import { useTeamMembers } from '../hooks/use-team-members'

type TeamAccessTabKey = 'members' | 'roles' | 'permissions' | 'invitations' | 'managers'

const TEAM_ACCESS_TABS: { key: TeamAccessTabKey; label: string }[] = [
  { key: 'members', label: 'Team Members' },
  { key: 'roles', label: 'Roles' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'invitations', label: 'Invitations' },
  { key: 'managers', label: 'Managers' },
]

export function TeamAccessPage() {
  const [activeTab, setActiveTab] = useState<TeamAccessTabKey>('members')
  const { data: members, isPending: membersPending } = useTeamMembers()
  const { data: roles, isPending: rolesPending } = useRoleDefinitions()
  const { data: matrix, isPending: matrixPending } = usePermissionMatrix()
  const { data: invitations, isPending: invitationsPending } = useInvitations()
  const { data: managers, isPending: managersPending } = useManagers()

  const pendingByTab: Record<TeamAccessTabKey, boolean> = {
    members: membersPending,
    roles: rolesPending || membersPending,
    permissions: matrixPending,
    invitations: invitationsPending,
    managers: managersPending,
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Team & Access</h1>
        <p className="mt-1 text-sm text-muted">
          Who can sign in to StackHR, what they can see, and how they got access — separate from employee records.
        </p>
      </div>

      <UnderlineTabs tabs={TEAM_ACCESS_TABS} active={activeTab} onChange={setActiveTab} />

      {pendingByTab[activeTab] ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'members' ? <TeamMembersView initialMembers={members ?? []} /> : null}
          {activeTab === 'roles' ? <RolesView roles={roles ?? []} members={members ?? []} /> : null}
          {activeTab === 'permissions' ? <PermissionsView matrix={matrix ?? []} /> : null}
          {activeTab === 'invitations' ? <InvitationsView initialInvitations={invitations ?? []} /> : null}
          {activeTab === 'managers' ? <ManagersView managers={managers ?? []} /> : null}
        </>
      )}
    </div>
  )
}
