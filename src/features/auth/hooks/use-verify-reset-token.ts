import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'

export function useVerifyResetToken(token: string | undefined) {
  return useQuery({
    queryKey: ['auth', 'reset-password-token', token],
    queryFn: () => authApi.verifyResetToken(token!),
    enabled: Boolean(token),
    retry: false,
  })
}
