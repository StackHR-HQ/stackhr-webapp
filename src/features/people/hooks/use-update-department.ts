import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { UpdateDepartmentPayload } from '../types/people-types'

export function useUpdateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateDepartmentPayload & { id: string }) =>
      peopleApi.updateDepartment(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people', 'departments'] }),
  })
}
