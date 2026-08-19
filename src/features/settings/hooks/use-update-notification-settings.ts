import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'
import type { NotificationSettings } from '../types/settings-types'

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: Partial<NotificationSettings>) => settingsService.updateNotificationSettings(patch),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings', 'notifications'], data)
    },
  })
}
