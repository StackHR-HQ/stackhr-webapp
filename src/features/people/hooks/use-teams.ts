import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useTeams() {
  return useQuery({
    queryKey: ['people', 'teams'],
    queryFn: () => peopleService.getTeams(),
  })
}
