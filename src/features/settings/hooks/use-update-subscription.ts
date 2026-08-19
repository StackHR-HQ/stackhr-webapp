import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'
import type { BillingSettings } from '../types/settings-types'

export function useUpdateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: Partial<BillingSettings['subscription']>) => settingsService.updateSubscription(patch),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings', 'billing'], data)
    },
  })
}
