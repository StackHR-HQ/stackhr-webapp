import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'
import type { OrganizationSettings } from '../types/settings-types'

export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (patch: Partial<OrganizationSettings>) => {
      await settingsService.updateOrganizationSettings(patch)
    },
    onSuccess: () => {
      // PATCH returns an intentionally partial/empty organization object.
      // Refetch the canonical full organization instead of replacing the cache.
      queryClient.invalidateQueries({ queryKey: ['settings', 'organization'] })
    },
  })
}
