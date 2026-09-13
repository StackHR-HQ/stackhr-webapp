import { http } from '../../../lib/http'
import type {
  AuthSession,
  LoginPayload,
  PendingSignup,
  SignupPayload,
  VerifyEmailOtpPayload,
} from '../types/auth-types'

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as auth-mock-api.ts so auth-service.ts can swap to
// this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const authApi = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const { data } = await http.post<AuthSession>('/auth/business/login', payload)
    return data
  },

  async signup(payload: SignupPayload): Promise<PendingSignup> {
    const { data } = await http.post<PendingSignup>('/auth/business/signup', payload)
    return data
  },

  async verifyEmailOtp(payload: VerifyEmailOtpPayload): Promise<AuthSession> {
    const { data } = await http.post<AuthSession>('/auth/business/verify-email', payload)
    return data
  },

  async resendEmailOtp(email: string): Promise<void> {
    await http.post('/auth/business/resend-verification', { email })
  },

  async requestPasswordReset(email: string): Promise<void> {
    await http.post('/auth/forgot-password', { email })
  },
}
