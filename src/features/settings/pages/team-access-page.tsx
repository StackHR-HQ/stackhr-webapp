import { KeyIcon, ShieldIcon, UserListIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ComingSoon } from '../../../components/ui/coming-soon'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { USE_MOCK_SETTINGS } from '../../../lib/env'
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
  // Only invitations have a backend; with real data the other tabs show Coming soon.
  const [activeTab, setActiveTab] = useState<TeamAccessTabKey>(USE_MOCK_SETTINGS ? 'members' : 'invitations')
  const { data: members, isPending: membersPending } = useTeamMembers(USE_MOCK_SETTINGS)
  const { data: roles, isPending: rolesPending } = useRoleDefinitions(USE_MOCK_SETTINGS)
  const { data: matrix, isPending: matrixPending } = usePermissionMatrix(USE_MOCK_SETTINGS)
  const { data: invitations, isPending: invitationsPending } = useInvitations()
  const { data: managers, isPending: managersPending } = useManagers(USE_MOCK_SETTINGS)

  const pendingByTab: Record<TeamAccessTabKey, boolean> = {
    members: USE_MOCK_SETTINGS && membersPending,
    roles: USE_MOCK_SETTINGS && (rolesPending || membersPending),
    permissions: USE_MOCK_SETTINGS && matrixPending,
    invitations: invitationsPending,
    managers: USE_MOCK_SETTINGS && managersPending,
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
      ) : !USE_MOCK_SETTINGS && activeTab !== 'invitations' ? (
        <>
          {activeTab === 'members' ? (
            <ComingSoon
              icon={UsersThreeIcon}
              title="Team members"
              description="Soon you'll see everyone who can sign in to StackHR, change their roles and remove access. Invite people from the Invitations tab."
            />
          ) : null}
          {activeTab === 'roles' ? (
            <ComingSoon
              icon={ShieldIcon}
              title="Roles"
              description="Soon you'll see what each role can do and who holds it."
            />
          ) : null}
          {activeTab === 'permissions' ? (
            <ComingSoon
              icon={KeyIcon}
              title="Permissions"
              description="Soon you'll see exactly which modules each role can view and change."
            />
          ) : null}
          {activeTab === 'managers' ? (
            <ComingSoon
              icon={UserListIcon}
              title="Managers"
              description="Soon you'll see every manager and the people who report to them."
            />
          ) : null}
        </>
      ) : (
        <>
          {activeTab === 'members' ? <TeamMembersView initialMembers={members ?? []} /> : null}
          {activeTab === 'roles' ? <RolesView roles={roles ?? []} members={members ?? []} /> : null}
          {activeTab === 'permissions' ? <PermissionsView matrix={matrix ?? []} /> : null}
          {activeTab === 'invitations' ? <InvitationsView invitations={invitations ?? []} /> : null}
          {activeTab === 'managers' ? <ManagersView managers={managers ?? []} /> : null}
        </>
      )}
    </div>
  )
}
