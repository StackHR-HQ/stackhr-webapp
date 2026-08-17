import { useQuery } from '@tanstack/react-query'
import { spendService } from '../api/spend-service'

export function useReimbursements() {
  return useQuery({
    queryKey: ['spend', 'reimbursements'],
    queryFn: () => spendService.getReimbursements(),
  })
}
