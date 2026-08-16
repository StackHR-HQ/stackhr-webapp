import { useMutation } from '@tanstack/react-query'
import { authService } from '../api/auth-service'

export function useResendEmailOtp() {
  return useMutation({
    mutationFn: (email: string) => authService.resendEmailOtp(email),
  })
}
