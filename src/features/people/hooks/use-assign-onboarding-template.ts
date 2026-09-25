import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { AssignOnboardingTemplatePayload } from '../types/people-types'

export function useAssignOnboardingTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AssignOnboardingTemplatePayload) => peopleApi.assignOnboardingTemplate(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people', 'onboarding', 'employees'] }),
  })
}
