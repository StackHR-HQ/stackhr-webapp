import { UsersThreeIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { ComingSoon } from '../../../components/ui/coming-soon'
import { DepartmentsView } from '../components/organization/departments-view'
import { OrgChartView } from '../components/organization/org-chart-view'
import { OrganizationTabs } from '../components/organization/organization-tabs'
import { ReportingStructureView } from '../components/organization/reporting-structure-view'
import { PeopleLoadError } from '../components/people-load-error'
import { useDepartments } from '../hooks/use-departments'
import { useEmployees } from '../hooks/use-employees'
import { buildOrgTree } from '../lib/org-tree'
import type { OrganizationTabKey } from '../lib/organization-tabs-data'

export function PeopleOrganizationPage() {
  const employeesQuery = useEmployees()
  const departmentsQuery = useDepartments()
  const { data: employees, isPending: employeesPending } = employeesQuery
  const { data: departments, isPending: departmentsPending } = departmentsQuery
  const [activeTab, setActiveTab] = useState<OrganizationTabKey>('departments')

  const tree = useMemo(() => buildOrgTree(employees ?? []), [employees])
  const isPending = employeesPending || departmentsPending
  const isError = employeesQuery.isError || departmentsQuery.isError

  function retry() {
    void employeesQuery.refetch()
    void departmentsQuery.refetch()
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
          {/* The backend only lists teams (GET /people/teams); there's no way to create, edit or delete one yet. The old TeamsView and its hooks were removed; rebuild them against the real contract when it ships. */}
          {activeTab === 'teams' ? (
            <ComingSoon
              icon={UsersThreeIcon}
              title="Teams"
              description="Soon you'll be able to group people who work together, including cross-functional squads."
            />
          ) : null}
          {activeTab === 'reporting' ? <ReportingStructureView tree={tree} /> : null}
          {activeTab === 'org-chart' ? <OrgChartView tree={tree} /> : null}
        </>
      )}
    </div>
  )
}
