import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TeamInput } from '../api/people-api'
import { peopleService } from '../api/people-service'

export function useCreateTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TeamInput) => peopleService.createTeam(payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['people', 'teams'] }),
  })
}
