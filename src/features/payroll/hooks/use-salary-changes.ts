import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useSalaryChanges() {
  return useQuery({
    queryKey: ['payroll', 'salaries', 'changes'],
    queryFn: () => payrollService.getSalaryChanges(),
  })
}
