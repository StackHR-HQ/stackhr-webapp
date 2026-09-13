import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'
import type { LeaveDecision } from '../api/people-api'

export function useDecideLeaveRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeaveDecision }) => peopleService.decideLeaveRequest(id, status),
    onSuccess: (request) => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'leave', 'requests'] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'leave', 'balances'] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'employees', request.employeeId] })
    },
  })
}
