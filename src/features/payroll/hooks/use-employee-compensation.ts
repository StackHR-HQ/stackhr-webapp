import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'
import type { SetCompensationPayload } from '../types/payroll-types'

export function useEmployeeCompensation(employeeId: string, enabled = true) {
  return useQuery({
    queryKey: ['payroll', 'salaries', 'compensation', employeeId],
    queryFn: () => payrollService.getEmployeeCompensation(employeeId),
    enabled,
  })
}

export function useSetCompensation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SetCompensationPayload) => payrollService.setCompensation(payload),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['payroll', 'salaries'] }),
        queryClient.invalidateQueries({ queryKey: ['people', 'employees'] }),
      ]),
  })
}
