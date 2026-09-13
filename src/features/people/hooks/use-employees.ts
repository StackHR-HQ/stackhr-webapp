import { useQuery } from '@tanstack/react-query'
import type { EmployeeDirectoryParams } from '../api/people-api'
import { peopleService } from '../api/people-service'

export function useEmployees() {
  return useQuery({
    queryKey: ['people', 'employees'],
    queryFn: () => peopleService.getEmployees(),
  })
}

export function useEmployeeDirectory(params: EmployeeDirectoryParams) {
  return useQuery({
    queryKey: ['people', 'employees', 'directory', params],
    queryFn: () => peopleService.getEmployeeDirectory(params),
  })
}
