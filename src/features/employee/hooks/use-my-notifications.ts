import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'

export function useMyNotifications() {
  return useQuery({
    queryKey: ['me', 'notifications'],
    queryFn: async () => {
      const notifications = await employeeApi.getNotifications()
      return [...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
  })
}
