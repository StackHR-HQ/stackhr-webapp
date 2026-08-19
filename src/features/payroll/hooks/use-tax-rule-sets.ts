import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useTaxRuleSets() {
  return useQuery({
    queryKey: ['payroll', 'tax-rule-sets'],
    queryFn: () => payrollService.getTaxRuleSets(),
  })
}
