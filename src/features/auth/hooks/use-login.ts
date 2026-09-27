import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import { useAuthStore } from '../store/auth-store'
import type { LoginPayload } from '../types/auth-types'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: LoginPayload & { rememberMe: boolean }) => authApi.login(payload),
    onSuccess: (session, variables) => {
      setSession(session, variables.rememberMe)
    },
  })
}
