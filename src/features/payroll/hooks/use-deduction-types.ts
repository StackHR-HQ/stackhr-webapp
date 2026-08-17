import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useDeductionTypes() {
  return useQuery({
    queryKey: ['payroll', 'salaries', 'deductions'],
    queryFn: () => payrollService.getDeductionTypes(),
  })
}
