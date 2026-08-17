import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useSalaryAdvances() {
  return useQuery({
    queryKey: ['payroll', 'salary-advances'],
    queryFn: () => payrollService.getSalaryAdvances(),
  })
}
