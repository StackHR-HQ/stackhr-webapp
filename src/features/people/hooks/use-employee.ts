import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: ['people', 'employees', id],
    queryFn: () => peopleService.getEmployee(id!),
    enabled: Boolean(id),
  })
}
