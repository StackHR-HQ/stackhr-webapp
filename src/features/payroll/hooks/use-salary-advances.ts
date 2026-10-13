import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { spendApi } from '../../spend/api/spend-api'
import { payrollService } from '../api/payroll-service'

export function useSalaryAdvances() {
  return useQuery({
    queryKey: ['payroll', 'salary-advances'],
    queryFn: () => payrollService.getSalaryAdvances(),
  })
}

export function useDisburseSalaryAdvance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => spendApi.disburseSalaryAdvance(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payroll', 'salary-advances'] }),
  })
}
