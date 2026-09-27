import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useLeaveTypes() {
  return useQuery({
    queryKey: ['people', 'leave', 'types'],
    queryFn: () => peopleApi.getLeaveTypes(),
  })
}
