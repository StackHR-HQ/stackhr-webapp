import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import { useAuthStore } from '../store/auth-store'

export function useSyncSession() {
  const isSignedIn = useAuthStore((state) => Boolean(state.user))
  const setSession = useAuthStore((state) => state.setSession)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const session = await authApi.getCurrentUser()
      setSession(session, useAuthStore.getState().rememberMe)
      return session
    },
    enabled: isSignedIn,
    staleTime: Infinity,
    retry: false,
  })
}
