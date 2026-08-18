import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'
import type { OrganizationSettings } from '../types/settings-types'

export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: Partial<OrganizationSettings>) => settingsService.updateOrganizationSettings(patch),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings', 'organization'], data)
    },
  })
}
