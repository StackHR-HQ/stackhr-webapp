import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useLeaveRequests() {
  return useQuery({
    queryKey: ['people', 'leave', 'requests'],
    queryFn: () => peopleApi.getLeaveRequests(),
  })
}
