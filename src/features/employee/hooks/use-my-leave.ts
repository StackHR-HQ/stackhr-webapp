import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'
import type { LeaveRequestPayload } from '../types/employee-types'

export function useMyLeaveBalances() {
  return useQuery({ queryKey: ['me', 'leave-balances'], queryFn: () => employeeApi.getLeaveBalances() })
}

export function useMyLeaveRequests() {
  return useQuery({ queryKey: ['me', 'leave-requests'], queryFn: () => employeeApi.getLeaveRequests() })
}

export function useLeaveTypeOptions() {
  return useQuery({ queryKey: ['me', 'leave-types'], queryFn: () => employeeApi.getLeaveTypes() })
}

export function useSubmitLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LeaveRequestPayload) => employeeApi.submitLeaveRequest(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
