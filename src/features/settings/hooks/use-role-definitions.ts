import { useQuery } from '@tanstack/react-query'
import { teamAccessService } from '../api/team-access-service'

export function useRoleDefinitions() {
  return useQuery({
    queryKey: ['settings', 'roles'],
    queryFn: () => teamAccessService.getRoleDefinitions(),
  })
}
