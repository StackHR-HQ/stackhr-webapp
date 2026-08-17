import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useEmployees() {
  return useQuery({
    queryKey: ['people', 'employees'],
    queryFn: () => peopleService.getEmployees(),
  })
}
