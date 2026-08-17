import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function usePayrollOverview() {
  return useQuery({
    queryKey: ['payroll', 'overview'],
    queryFn: () => payrollService.getOverview(),
  })
}
