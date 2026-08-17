import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useLeaveRequests() {
  return useQuery({
    queryKey: ['people', 'leave', 'requests'],
    queryFn: () => peopleService.getLeaveRequests(),
  })
}
