import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { LeaveTypeFormValues } from '../schemas/leave-type-schema'

export function useCreateLeaveType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: LeaveTypeFormValues) => peopleApi.createLeaveType(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'leave'] })
    },
  })
}
