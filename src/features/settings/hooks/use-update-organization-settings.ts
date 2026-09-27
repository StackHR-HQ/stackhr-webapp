import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '../../../lib/api-error'
import { notify } from '../../../lib/toast'
import { settingsService } from '../api/settings-service'
import type { OrganizationSettings } from '../types/settings-types'

export function useUpdateOrganizationSettings(section = 'Organization settings') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (patch: Partial<OrganizationSettings>) => {
      await settingsService.updateOrganizationSettings(patch)
    },
    onSuccess: () => {
      // PATCH returns an intentionally partial/empty organization object.
      // Refetch the canonical full organization instead of replacing the cache.
      queryClient.invalidateQueries({ queryKey: ['settings', 'organization'] })
      notify.success(`${section} saved`, 'Your changes have been applied.')
    },
    onError: (error) => {
      notify.error(`Could not save ${section.toLowerCase()}`, getApiErrorMessage(error, 'Please try again.'))
    },
  })
}
