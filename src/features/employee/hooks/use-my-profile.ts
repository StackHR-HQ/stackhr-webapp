import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'
import type { ProfileUpdate } from '../types/employee-types'

export function useMyProfile() {
  return useQuery({
    queryKey: ['me', 'profile'],
    queryFn: () => employeeApi.getProfile(),
  })
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (update: ProfileUpdate) => employeeApi.updateProfile(update),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['me', 'profile'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'activity'] }),
      ]),
  })
}
