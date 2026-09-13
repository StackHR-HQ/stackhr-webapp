import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useDeferredValue, useState } from 'react'
import { EmployeeStatusTabs, type EmployeeStatusFilter } from '../components/employees/employee-status-tabs'
import { EmployeesTable } from '../components/employees/employees-table'
import { PeopleLoadError } from '../components/people-load-error'
import { useDepartments } from '../hooks/use-departments'
import { useEmployeeDirectory } from '../hooks/use-employees'
import { useEmployeeStatusCounts } from '../hooks/use-employee-status-counts'

export function EmployeesPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [statusFilter, setStatusFilter] = useState<EmployeeStatusFilter>('all')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const directoryQuery = useEmployeeDirectory({
    page,
    pageSize,
    search: deferredSearch,
    employmentStatus: statusFilter === 'all' ? undefined : statusFilter,
  })
  const { data: departments } = useDepartments()
  const counts = useEmployeeStatusCounts()
  const directory = directoryQuery.data
  const pageCount = Math.max(1, Math.ceil((directory?.total ?? 0) / pageSize))

  function changeStatus(status: EmployeeStatusFilter) {
    setStatusFilter(status)
    setPage(1)
  }

  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function changePageSize(value: number) {
    setPageSize(value)
    setPage(1)
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Employees</h1>
        <p className="mt-1 text-sm text-muted">Browse and manage everyone in your organization.</p>
      </div>

      {directoryQuery.isError ? (
        <PeopleLoadError resource="employees" onRetry={() => void directoryQuery.refetch()} />
      ) : (
        <div className="space-y-4">
          <EmployeeStatusTabs active={statusFilter} counts={counts} onChange={changeStatus} />

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Search by name, email, or job title"
                className="w-full rounded-lg border border-line bg-canvas py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              Rows
              <select
                value={pageSize}
                onChange={(event) => changePageSize(Number(event.target.value))}
                className="rounded-lg border border-line bg-canvas px-2 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {directoryQuery.isPending ? (
            <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
          ) : (
            <>
              <EmployeesTable employees={directory?.items ?? []} departments={departments ?? []} />
              {directory && directory.total > 0 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                  <p>
                    Showing {(directory.page - 1) * directory.pageSize + 1}–{Math.min(directory.page * directory.pageSize, directory.total)} of {directory.total}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={directory.page <= 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      className="rounded-lg border border-line px-3 py-1.5 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:text-muted"
                    >
                      Previous
                    </button>
                    <span>
                      Page {directory.page} of {pageCount}
                    </span>
                    <button
                      type="button"
                      disabled={directory.page >= pageCount}
                      onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                      className="rounded-lg border border-line px-3 py-1.5 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:text-muted"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  )
}
