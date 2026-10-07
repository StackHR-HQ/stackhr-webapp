import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approvalsApi } from '../api/approvals-api'
import type { ApprovalDecision } from '../types/approval-request-types'

export function useDecideApproval() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApprovalDecision }) => approvalsApi.decide(id, status),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['spend'] }),
        queryClient.invalidateQueries({ queryKey: ['payroll', 'salary-advances'] }),
      ]),
  })
}
