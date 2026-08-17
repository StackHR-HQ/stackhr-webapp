import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useEmployeeSalaries() {
  return useQuery({
    queryKey: ['payroll', 'salaries', 'employees'],
    queryFn: () => payrollService.getEmployeeSalaries(),
  })
}
