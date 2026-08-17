import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useDepartments() {
  return useQuery({
    queryKey: ['people', 'departments'],
    queryFn: () => peopleService.getDepartments(),
  })
}
