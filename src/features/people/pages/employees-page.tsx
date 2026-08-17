import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { EmployeeStatusTabs, type EmployeeStatusFilter } from '../components/employees/employee-status-tabs'
import { EmployeesTable } from '../components/employees/employees-table'
import { useDepartments } from '../hooks/use-departments'
import { useEmployees } from '../hooks/use-employees'

export function EmployeesPage() {
  const { data: employees, isPending, isError, refetch } = useEmployees()
  const { data: departments } = useDepartments()
  const [statusFilter, setStatusFilter] = useState<EmployeeStatusFilter>('all')
  const [search, setSearch] = useState('')

  const counts = useMemo(() => {
    const base: Record<EmployeeStatusFilter, number> = {
      all: employees?.length ?? 0,
      active: 0,
      pending_invitation: 0,
      onboarding: 0,
      offboarding: 0,
    }
    for (const employee of employees ?? []) {
      base[employee.employmentStatus] += 1
    }
    return base
  }, [employees])

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (employees ?? []).filter((employee) => {
      const matchesStatus = statusFilter === 'all' || employee.employmentStatus === statusFilter
      const matchesSearch =
        !query ||
        employee.fullName.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.jobTitle.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [employees, statusFilter, search])

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Employees</h1>
        <p className="mt-1 text-sm text-muted">Browse and manage everyone in your organization.</p>
      </div>

      {isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load employees</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <EmployeeStatusTabs active={statusFilter} counts={counts} onChange={setStatusFilter} />

          <div className="relative max-w-sm">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or job title"
              className="w-full rounded-lg border border-line bg-canvas py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          {isPending ? (
            <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
          ) : (
            <EmployeesTable employees={filteredEmployees} departments={departments ?? []} />
          )}
        </div>
      )}
    </div>
  )
}
