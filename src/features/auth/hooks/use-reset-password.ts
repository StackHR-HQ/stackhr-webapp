import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import type { ResetPasswordPayload } from '../types/auth-types'

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
  })
}
