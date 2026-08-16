import { useMutation } from '@tanstack/react-query'
import { authService } from '../api/auth-service'
import { useAuthStore } from '../store/auth-store'
import type { SignupPayload } from '../types/auth-types'

export function useSignup() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: (session) => {
      // Just created the account — keep them signed in across restarts.
      setSession(session, true)
    },
  })
}
