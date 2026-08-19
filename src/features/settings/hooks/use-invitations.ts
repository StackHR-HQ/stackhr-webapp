import { useQuery } from '@tanstack/react-query'
import { teamAccessService } from '../api/team-access-service'

export function useInvitations() {
  return useQuery({
    queryKey: ['settings', 'invitations'],
    queryFn: () => teamAccessService.getInvitations(),
  })
}
