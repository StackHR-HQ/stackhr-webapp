import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useLeavePolicies() {
  return useQuery({
    queryKey: ['people', 'leave', 'policies'],
    queryFn: () => peopleService.getLeavePolicies(),
  })
}
