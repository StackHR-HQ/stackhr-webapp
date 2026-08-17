import { useQuery } from '@tanstack/react-query'
import { spendService } from '../api/spend-service'

export function useSpendApprovals() {
  return useQuery({
    queryKey: ['spend', 'approvals'],
    queryFn: () => spendService.getApprovalRequests(),
  })
}
