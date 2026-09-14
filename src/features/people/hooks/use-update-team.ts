import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TeamInput } from '../api/people-api'
import { peopleService } from '../api/people-service'

export function useUpdateTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TeamInput }) => peopleService.updateTeam(id, payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['people', 'teams'] }),
  })
}
