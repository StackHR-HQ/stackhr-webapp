import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'

export function useBillingSettings(enabled = true) {
  return useQuery({
    queryKey: ['settings', 'billing'],
    queryFn: () => settingsService.getBillingSettings(),
    enabled,
  })
}
