import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useDeductionTypes(enabled = true) {
  return useQuery({
    queryKey: ['payroll', 'salaries', 'deductions'],
    queryFn: () => payrollService.getDeductionTypes(),
    enabled,
  })
}
