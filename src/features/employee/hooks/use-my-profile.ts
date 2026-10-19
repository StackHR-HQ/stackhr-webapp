import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { employeeApi } from '../api/employee-api'
import type { ProfileUpdate } from '../types/employee-types'

// /me/* answers 404 when the signed-in member has no employee record in this
// organization, e.g. an owner or accountant who isn't on payroll.
export function isEmployeeRecordMissing(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['me', 'profile'],
    queryFn: () => employeeApi.getProfile(),
    // Retrying won't create the missing record.
    retry: (failureCount, error) => !isEmployeeRecordMissing(error) && failureCount < 3,
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
