import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function usePayslips() {
  return useQuery({
    queryKey: ['payroll', 'payslips'],
    queryFn: () => payrollService.getPayslips(),
  })
}
