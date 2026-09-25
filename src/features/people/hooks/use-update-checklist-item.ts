import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { UpdateChecklistItemPayload } from '../types/people-types'

export function useUpdateChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateChecklistItemPayload) => peopleApi.updateChecklistItem(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people', 'onboarding', 'employees'] }),
  })
}
