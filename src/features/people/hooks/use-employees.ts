import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { EmployeeDirectoryParams } from '../types/people-types'

export function useEmployees() {
  return useQuery({
    queryKey: ['people', 'employees'],
    queryFn: () => peopleApi.getEmployees(),
  })
}

export function useEmployeeDirectory(params: EmployeeDirectoryParams) {
  return useQuery({
    queryKey: ['people', 'employees', 'directory', params],
    queryFn: () => peopleApi.getEmployeeDirectory(params),
  })
}
