import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useEarningComponents() {
  return useQuery({
    queryKey: ['payroll', 'salaries', 'allowances'],
    queryFn: () => payrollService.getEarningComponents(),
  })
}
