import { useMutation } from '@tanstack/react-query'
import { authService } from '../api/auth-service'
import type { SignupPayload } from '../types/auth-types'

// Signing up doesn't establish a session yet — the account is pending until
// the email is verified via useVerifyEmailOtp.
export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
  })
}
