import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useLeavePolicies() {
  return useQuery({
    queryKey: ['people', 'leave', 'policies'],
    queryFn: () => peopleApi.getLeavePolicies(),
  })
}
