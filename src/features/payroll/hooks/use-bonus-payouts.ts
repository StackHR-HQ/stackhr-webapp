import { useQuery } from '@tanstack/react-query'
import { payrollService } from '../api/payroll-service'

export function useBonusPayouts() {
  return useQuery({
    queryKey: ['payroll', 'salaries', 'bonuses'],
    queryFn: () => payrollService.getBonusPayouts(),
  })
}
