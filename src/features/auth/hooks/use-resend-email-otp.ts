import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'

export function useResendEmailOtp() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendEmailOtp(email),
  })
}
