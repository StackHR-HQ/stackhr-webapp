import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import { useAuthStore } from '../store/auth-store'

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearSession()
    },
  })
}
