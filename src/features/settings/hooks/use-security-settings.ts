import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'

export function useSecuritySettings() {
  return useQuery({
    queryKey: ['settings', 'security'],
    queryFn: () => settingsService.getSecuritySettings(),
  })
}
