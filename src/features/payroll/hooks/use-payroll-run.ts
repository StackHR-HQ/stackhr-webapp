import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function usePayrollRun(id: string | undefined) {
  return useQuery({
    queryKey: ['payroll', 'runs', id],
    queryFn: () => payrollService.getRun(id!),
    enabled: Boolean(id),
  })
}
