import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useEmployees() {
  return useQuery({
    queryKey: ['people', 'employees'],
    queryFn: () => peopleApi.getEmployees(),
  })
}
