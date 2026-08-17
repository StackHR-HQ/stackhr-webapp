import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useSalaryBands() {
  return useQuery({
    queryKey: ['payroll', 'salaries', 'bands'],
    queryFn: () => payrollService.getSalaryBands(),
  })
}
