import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'

export function usePayrollSettings() {
  return useQuery({
    queryKey: ['settings', 'payroll'],
    queryFn: () => settingsService.getPayrollSettings(),
  })
}
