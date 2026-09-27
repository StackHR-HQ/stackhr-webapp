import { useQuery } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useLeaveBalances() {
  return useQuery({
    queryKey: ['people', 'leave', 'balances'],
    queryFn: () => peopleApi.getLeaveBalances(),
  })
}
