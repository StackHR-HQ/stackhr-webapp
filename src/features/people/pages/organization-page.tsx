import { useMemo, useState } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import { DepartmentsView } from '../components/organization/departments-view'
import { OrgChartView } from '../components/organization/org-chart-view'
import { OrganizationTabs } from '../components/organization/organization-tabs'
import { ReportingStructureView } from '../components/organization/reporting-structure-view'
import { TeamsView } from '../components/organization/teams-view'
import { PeopleLoadError } from '../components/people-load-error'
import { useDepartments } from '../hooks/use-departments'
import { useEmployees } from '../hooks/use-employees'
import { useTeams } from '../hooks/use-teams'
import { buildOrgTree } from '../lib/org-tree'
import type { OrganizationTabKey } from '../lib/organization-tabs-data'

export function PeopleOrganizationPage() {
  const canManageTeams = useAuthStore((state) => state.user?.role === 'admin')
  const employeesQuery = useEmployees()
  const departmentsQuery = useDepartments()
  const teamsQuery = useTeams()
  const { data: employees, isPending: employeesPending } = employeesQuery
  const { data: departments, isPending: departmentsPending } = departmentsQuery
  const { data: teams, isPending: teamsPending } = teamsQuery
  const [activeTab, setActiveTab] = useState<OrganizationTabKey>('departments')

  const tree = useMemo(() => buildOrgTree(employees ?? []), [employees])
  const isPending = employeesPending || departmentsPending || teamsPending
  const isError = employeesQuery.isError || departmentsQuery.isError || teamsQuery.isError

  function retry() {
    void employeesQuery.refetch()
    void departmentsQuery.refetch()
    void teamsQuery.refetch()
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Organization</h1>
        <p className="mt-1 text-sm text-muted">How your company is structured, from departments to reporting lines.</p>
      </div>

      <OrganizationTabs active={activeTab} onChange={setActiveTab} />

      {isError ? (
        <PeopleLoadError resource="organization data" onRetry={retry} />
      ) : isPending ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'departments' ? (
            <DepartmentsView departments={departments ?? []} employees={employees ?? []} />
          ) : null}
          {activeTab === 'teams' ? <TeamsView teams={teams ?? []} employees={employees ?? []} canManage={canManageTeams} /> : null}
          {activeTab === 'reporting' ? <ReportingStructureView tree={tree} /> : null}
          {activeTab === 'org-chart' ? <OrgChartView tree={tree} /> : null}
        </>
      )}
    </div>
  )
}
