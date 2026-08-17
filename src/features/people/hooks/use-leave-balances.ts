import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useLeaveBalances() {
  return useQuery({
    queryKey: ['people', 'leave', 'balances'],
    queryFn: () => peopleService.getLeaveBalances(),
  })
}
