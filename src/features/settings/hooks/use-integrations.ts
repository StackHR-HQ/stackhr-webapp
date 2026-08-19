import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'

export function useIntegrations() {
  return useQuery({
    queryKey: ['settings', 'integrations'],
    queryFn: () => settingsService.getIntegrations(),
  })
}
