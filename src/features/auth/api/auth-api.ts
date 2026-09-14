import { http } from '../../../lib/http'
import { getApiErrorMessage } from '../../../lib/api-error'
import type {
  AuthSession,
  LoginPayload,
  PendingSignup,
  SignupPayload,
  VerifyEmailOtpPayload,
} from '../types/auth-types'
import { AuthError } from '../types/auth-types'

async function authRequest<T>(request: Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await request
    return data
  } catch (error) {
    throw new AuthError(getApiErrorMessage(error, 'Something went wrong. Please try again.'))
  }
}

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as auth-mock-api.ts so auth-service.ts can swap to
// this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const authApi = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    return authRequest(http.post<AuthSession>('/auth/business/login', payload))
  },

  async signup(payload: SignupPayload): Promise<PendingSignup> {
    return authRequest(http.post<PendingSignup>('/auth/business/signup', payload))
  },

  async verifyEmailOtp(payload: VerifyEmailOtpPayload): Promise<AuthSession> {
    return authRequest(http.post<AuthSession>('/auth/business/verify-email', payload))
  },

  async resendEmailOtp(email: string): Promise<void> {
    await authRequest(http.post<void>('/auth/business/resend-verification', { email }))
  },

  async requestPasswordReset(email: string): Promise<void> {
    await authRequest(http.post<void>('/auth/forgot-password', { email }))
  },
}
