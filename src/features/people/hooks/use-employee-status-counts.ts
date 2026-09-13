import { useQueries } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'
import type { EmploymentStatus } from '../types/people-types'

const STATUSES: Array<'all' | EmploymentStatus> = ['all', 'active', 'pending_invitation', 'onboarding', 'offboarding']

export function useEmployeeStatusCounts() {
  const queries = useQueries({
    queries: STATUSES.map((status) => ({
      queryKey: ['people', 'employees', 'count', status],
      queryFn: () =>
        peopleService.getEmployeeDirectory({
          page: 1,
          pageSize: 1,
          employmentStatus: status === 'all' ? undefined : status,
        }),
    })),
  })

  return STATUSES.reduce(
    (counts, status, index) => ({ ...counts, [status]: queries[index]?.data?.total ?? 0 }),
    {} as Record<'all' | EmploymentStatus, number>,
  )
}
