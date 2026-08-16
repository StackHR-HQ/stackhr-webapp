import { useMutation } from '@tanstack/react-query'
import { authService } from './service'
import { useAuthStore } from './store'
import type { LoginPayload } from './types'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: LoginPayload & { rememberMe: boolean }) => authService.login(payload),
    onSuccess: (session, variables) => {
      setSession(session, variables.rememberMe)
    },
  })
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
  })
}
