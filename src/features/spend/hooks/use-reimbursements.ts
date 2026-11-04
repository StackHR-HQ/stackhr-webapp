import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { spendService } from '../api/spend-service'

export function useReimbursements() {
  return useQuery({
    queryKey: ['spend', 'reimbursements'],
    queryFn: () => spendService.getReimbursements(),
  })
}

export function useMarkReimbursementPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => spendService.markReimbursementPaid(id),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['spend'] }),
        queryClient.invalidateQueries({ queryKey: ['approvals'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]),
  })
}
