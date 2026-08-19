import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'
import type { AuthenticationSettings } from '../types/settings-types'

export function useUpdateAuthenticationSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: Partial<AuthenticationSettings>) => settingsService.updateAuthenticationSettings(patch),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings', 'security'], data)
    },
  })
}
