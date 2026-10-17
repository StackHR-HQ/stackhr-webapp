import { useQuery } from '@tanstack/react-query'
import { teamAccessService } from '../api/team-access-service'

export function useTeamMembers(enabled = true) {
  return useQuery({
    queryKey: ['settings', 'team-members'],
    queryFn: () => teamAccessService.getTeamMembers(),
    enabled,
  })
}
