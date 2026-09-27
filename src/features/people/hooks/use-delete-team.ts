import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useDeleteTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => peopleApi.deleteTeam(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['people', 'teams'] }),
  })
}
