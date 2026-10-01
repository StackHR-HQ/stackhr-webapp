import { useMutation } from '@tanstack/react-query'
import { notify } from '../../../lib/toast'
import { authApi } from '../api/auth-api'
import { AuthError, type ChangePasswordPayload } from '../types/auth-types'

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authApi.changePassword(payload),
    onSuccess: () => {
      notify.success('Password changed', 'Your password has been updated.')
    },
    onError: (error) => {
      const message = error instanceof AuthError ? error.message : 'Please try again.'
      notify.error('Could not change password', message)
    },
  })
}
