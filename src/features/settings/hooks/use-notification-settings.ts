import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'

export function useNotificationSettings() {
  return useQuery({
    queryKey: ['settings', 'notifications'],
    queryFn: () => settingsService.getNotificationSettings(),
  })
}
