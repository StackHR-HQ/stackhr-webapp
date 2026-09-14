import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleService } from '../api/people-service'

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => peopleService.deleteTeam(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['people', 'teams'] }),
  })
}
