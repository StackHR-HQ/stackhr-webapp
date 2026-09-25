import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import { useAuthStore } from '../store/auth-store'
import type { VerifyEmailOtpPayload } from '../types/auth-types'

export function useVerifyEmailOtp() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: VerifyEmailOtpPayload) => authApi.verifyEmailOtp(payload),
    onSuccess: (session) => {
      // Just verified — keep them signed in across restarts.
      setSession(session, true)
    },
  })
}
