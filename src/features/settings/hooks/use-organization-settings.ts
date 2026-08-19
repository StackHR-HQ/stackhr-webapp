import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'

export function useOrganizationSettings() {
  return useQuery({
    queryKey: ['settings', 'organization'],
    queryFn: () => settingsService.getOrganizationSettings(),
  })
}
