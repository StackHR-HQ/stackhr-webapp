import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'

export function useSecuritySettings(enabled = true) {
  return useQuery({
    queryKey: ['settings', 'security'],
    queryFn: () => settingsService.getSecuritySettings(),
    enabled,
  })
}
