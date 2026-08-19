import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'
import type { IntegrationStatus } from '../types/settings-types'

export function useUpdateIntegrationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ integrationId, status }: { integrationId: string; status: IntegrationStatus }) =>
      settingsService.updateIntegrationStatus(integrationId, status),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings', 'integrations'], data)
    },
  })
}
