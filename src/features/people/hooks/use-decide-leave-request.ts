import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { DecideLeaveRequestPayload } from '../types/people-types'

export function useDecideLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DecideLeaveRequestPayload) => peopleApi.decideLeaveRequest(payload),
    onSuccess: (request) => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'leave', 'requests'] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'leave', 'balances'] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'employees', request.employeeId] })
    },
  })
}
