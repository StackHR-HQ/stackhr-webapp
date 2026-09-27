import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { TeamInput } from '../types/people-types'

export function useUpdateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TeamInput }) => peopleApi.updateTeam(id, payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['people', 'teams'] }),
  })
}
