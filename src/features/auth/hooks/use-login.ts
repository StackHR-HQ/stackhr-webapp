import { useMutation } from '@tanstack/react-query'
import { authService } from '../api/auth-service'
import { useAuthStore } from '../store/auth-store'
import type { LoginPayload } from '../types/auth-types'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: LoginPayload & { rememberMe: boolean }) => authService.login(payload),
    onSuccess: (session, variables) => {
      setSession(session, variables.rememberMe)
    },
  })
}
