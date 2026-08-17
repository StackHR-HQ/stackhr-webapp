import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useLeaveTypes() {
  return useQuery({
    queryKey: ['people', 'leave', 'types'],
    queryFn: () => peopleService.getLeaveTypes(),
  })
}
