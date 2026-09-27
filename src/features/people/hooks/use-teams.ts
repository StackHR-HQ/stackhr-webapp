import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useTeams() {
  return useQuery({
    queryKey: ['people', 'teams'],
    queryFn: () => peopleApi.getTeams(),
  })
}
