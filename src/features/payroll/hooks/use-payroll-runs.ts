import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function usePayrollRuns() {
  return useQuery({
    queryKey: ['payroll', 'runs'],
    queryFn: () => payrollService.getRuns(),
  })
}
