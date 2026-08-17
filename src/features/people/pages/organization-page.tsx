import { useMemo, useState } from 'react'
import { DepartmentsView } from '../components/organization/departments-view'
import { OrgChartView } from '../components/organization/org-chart-view'
import { OrganizationTabs } from '../components/organization/organization-tabs'
import { ReportingStructureView } from '../components/organization/reporting-structure-view'
import { TeamsView } from '../components/organization/teams-view'
import { useDepartments } from '../hooks/use-departments'
import { useEmployees } from '../hooks/use-employees'
import { useTeams } from '../hooks/use-teams'
import { buildOrgTree } from '../lib/org-tree'
import type { OrganizationTabKey } from '../lib/organization-tabs-data'

export function PeopleOrganizationPage() {
  const { data: employees, isPending: employeesPending } = useEmployees()
  const { data: departments, isPending: departmentsPending } = useDepartments()
  const { data: teams, isPending: teamsPending } = useTeams()
  const [activeTab, setActiveTab] = useState<OrganizationTabKey>('departments')

  const tree = useMemo(() => buildOrgTree(employees ?? []), [employees])
  const isPending = employeesPending || departmentsPending || teamsPending

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Organization</h1>
        <p className="mt-1 text-sm text-muted">How your company is structured, from departments to reporting lines.</p>
      </div>

      <OrganizationTabs active={activeTab} onChange={setActiveTab} />

      {isPending ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'departments' ? (
            <DepartmentsView departments={departments ?? []} employees={employees ?? []} />
          ) : null}
          {activeTab === 'teams' ? <TeamsView teams={teams ?? []} employees={employees ?? []} /> : null}
          {activeTab === 'reporting' ? <ReportingStructureView tree={tree} /> : null}
          {activeTab === 'org-chart' ? <OrgChartView tree={tree} /> : null}
        </>
      )}
    </div>
  )
}
