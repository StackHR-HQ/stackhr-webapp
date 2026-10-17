import { useQuery } from '@tanstack/react-query'
import { teamAccessService } from '../api/team-access-service'

export function useRoleDefinitions(enabled = true) {
  return useQuery({
    queryKey: ['settings', 'roles'],
    queryFn: () => teamAccessService.getRoleDefinitions(),
    enabled,
  })
}
