import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'

export function useMyProfile() {
  return useQuery({
    queryKey: ['me', 'profile'],
    queryFn: () => employeeApi.getProfile(),
  })
}
