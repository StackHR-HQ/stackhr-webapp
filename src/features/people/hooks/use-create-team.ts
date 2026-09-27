import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { TeamInput } from '../types/people-types'

export function useCreateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TeamInput) => peopleApi.createTeam(payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['people', 'teams'] }),
  })
}
