import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ActivityTab } from '../components/profile/activity-tab'
import { CompensationTab } from '../components/profile/compensation-tab'
import { DocumentsTab } from '../components/profile/documents-tab'
import { EmploymentTab } from '../components/profile/employment-tab'
import { ExpensesTab } from '../components/profile/expenses-tab'
import { LeaveTab } from '../components/profile/leave-tab'
import { OverviewTab } from '../components/profile/overview-tab'
import { PayrollTab } from '../components/profile/payroll-tab'
import { PersonalInfoTab } from '../components/profile/personal-info-tab'
import { ProfileHeader } from '../components/profile/profile-header'
import { ProfileTabs } from '../components/profile/profile-tabs'
import { SalaryAdvancesTab } from '../components/profile/salary-advances-tab'
import { useDepartments } from '../hooks/use-departments'
import { useEmployee } from '../hooks/use-employee'
import { useEmployees } from '../hooks/use-employees'
import type { ProfileTabKey } from '../lib/profile-tabs-data'

export function EmployeeProfilePage() {
  const { employeeId } = useParams<{ employeeId: string }>()
  const { data: employee, isPending, isError, refetch } = useEmployee(employeeId)
  const { data: departments } = useDepartments()
  const { data: employees } = useEmployees()
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('overview')

  if (isPending) {
    return (
      <div className="max-w-[1400px] space-y-5">
        <div className="h-28 animate-pulse rounded-panel border border-line bg-surface" />
        <div className="h-96 animate-pulse rounded-panel border border-line bg-surface" />
      </div>
    )
  }

  if (isError || !employee) {
    return (
      <div className="max-w-md rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
        <p className="text-sm font-medium text-ink">Couldn't load this employee</p>
        <p className="mt-1 text-sm text-muted">They may not exist, or something went wrong.</p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Try again
          </button>
          <Link
            to="/people/employees"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            Back to employees
          </Link>
        </div>
      </div>
    )
  }

  const department = departments?.find((item) => item.id === employee.departmentId)
  const manager = employees?.find((item) => item.id === employee.managerId)
  const directReports = employees?.filter((item) => item.managerId === employee.id) ?? []

  return (
    <div className="max-w-[1400px] space-y-5">
      <Link to="/people/employees" className="text-xs font-medium text-muted hover:text-ink">
        ← Back to employees
      </Link>

      <ProfileHeader employee={employee} department={department} />

      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      <div>
        {activeTab === 'overview' ? <OverviewTab employee={employee} department={department} manager={manager} /> : null}
        {activeTab === 'personal' ? <PersonalInfoTab employee={employee} /> : null}
        {activeTab === 'employment' ? (
          <EmploymentTab employee={employee} department={department} manager={manager} directReports={directReports} />
        ) : null}
        {activeTab === 'compensation' ? <CompensationTab employee={employee} /> : null}
        {activeTab === 'leave' ? <LeaveTab employee={employee} /> : null}
        {activeTab === 'documents' ? <DocumentsTab employee={employee} /> : null}
        {activeTab === 'payroll' ? <PayrollTab employee={employee} /> : null}
        {activeTab === 'expenses' ? <ExpensesTab employee={employee} /> : null}
        {activeTab === 'salary-advances' ? <SalaryAdvancesTab employee={employee} /> : null}
        {activeTab === 'activity' ? <ActivityTab employee={employee} /> : null}
      </div>
    </div>
  )
}
