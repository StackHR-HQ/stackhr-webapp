import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useComplianceOverview() {
  return useQuery({
    queryKey: ['payroll', 'compliance-overview'],
    queryFn: () => payrollService.getComplianceOverview(),
  })
}
