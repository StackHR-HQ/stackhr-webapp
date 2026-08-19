import { useQuery } from '@tanstack/react-query'
import { teamAccessService } from '../api/team-access-service'

export function useManagers() {
  return useQuery({
    queryKey: ['settings', 'managers'],
    queryFn: () => teamAccessService.getManagers(),
  })
}
