import { http } from '../../../lib/http'
import type { AuthSession, LoginPayload, SignupPayload } from '../types/auth-types'

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as auth-mock-api.ts so auth-service.ts can swap to
// this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const authApi = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const { data } = await http.post<AuthSession>('/auth/login', payload)
    return data
  },

  async signup(payload: SignupPayload): Promise<AuthSession> {
    const { data } = await http.post<AuthSession>('/auth/signup', payload)
    return data
  },

  async requestPasswordReset(email: string): Promise<void> {
    await http.post('/auth/forgot-password', { email })
  },
}
