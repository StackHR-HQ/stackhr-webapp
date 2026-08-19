import { useQuery } from '@tanstack/react-query'
import { teamAccessService } from '../api/team-access-service'

export function usePermissionMatrix() {
  return useQuery({
    queryKey: ['settings', 'permissions'],
    queryFn: () => teamAccessService.getPermissionMatrix(),
  })
}
