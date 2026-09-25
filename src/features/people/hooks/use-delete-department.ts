import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useDeleteDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => peopleApi.deleteDepartment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people', 'departments'] }),
  })
}
