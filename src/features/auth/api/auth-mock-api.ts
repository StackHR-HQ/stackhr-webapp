import { slugify } from '../../../lib/slugify'
import {
  AuthError,
  type AuthSession,
  type LoginPayload,
  type PendingSignup,
  type SignupPayload,
  type VerifyEmailOtpPayload,
} from '../types/auth-types'

// Stands in for the real backend until the auth endpoints exist. Delays are
// simulated so loading states are actually visible while testing the flow.
const DEMO_ORG_SLUG = 'acme'
const DEMO_EMAIL = 'demo@stackhr.app'
const DEMO_PASSWORD = 'password123'
export const DEMO_OTP_CODE = '123456'

export const DEMO_LOGIN_CREDENTIALS = {
  orgSlug: DEMO_ORG_SLUG,
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// A real backend would persist the pending signup and email an actual code.
// Keyed by lowercased email; cleared once the account is verified.
const pendingSignups = new Map<string, SignupPayload>()
const verifiedSignups = new Map<string, SignupPayload>()
const VERIFIED_SIGNUPS_STORAGE_KEY = 'stackhr.mock.verified-signups'

function getVerifiedSignup(email: string): SignupPayload | undefined {
  const normalizedEmail = email.toLowerCase()
  const inMemory = verifiedSignups.get(normalizedEmail)
  if (inMemory) return inMemory

  try {
    const stored = JSON.parse(localStorage.getItem(VERIFIED_SIGNUPS_STORAGE_KEY) ?? '{}') as Record<string, SignupPayload>
    const verified = stored[normalizedEmail]
    if (verified) verifiedSignups.set(normalizedEmail, verified)
    return verified
  } catch {
    return undefined
  }
}

function saveVerifiedSignup(email: string, signup: SignupPayload) {
  const normalizedEmail = email.toLowerCase()
  verifiedSignups.set(normalizedEmail, signup)

  try {
    const stored = JSON.parse(localStorage.getItem(VERIFIED_SIGNUPS_STORAGE_KEY) ?? '{}') as Record<string, SignupPayload>
    stored[normalizedEmail] = signup
    localStorage.setItem(VERIFIED_SIGNUPS_STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // The in-memory account is sufficient in non-browser test environments.
  }
}

export const mockAuthApi = {
  async login({ orgSlug, email, password }: LoginPayload): Promise<AuthSession> {
    await delay(700)

    const normalizedEmail = email.toLowerCase()
    if (orgSlug.toLowerCase() === DEMO_ORG_SLUG && normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return {
        user: {
          id: 'user_demo_1',
          email: DEMO_EMAIL,
          name: 'Demo Admin',
          orgSlug: DEMO_ORG_SLUG,
          orgName: 'Acme Inc.',
          role: 'admin',
        },
        token: 'mock.jwt.token',
      }
    }

    const verified = getVerifiedSignup(normalizedEmail)
    if (!verified || slugify(verified.companyName) !== orgSlug.toLowerCase() || verified.password !== password) {
      throw new AuthError('Incorrect workspace, email, or password.')
    }

    return {
      user: {
        id: `user_${normalizedEmail}`,
        email: verified.email,
        name: verified.email.split('@')[0] ?? verified.email,
        orgSlug: slugify(verified.companyName),
        orgName: verified.companyName,
        role: 'admin',
      },
      token: 'mock.jwt.token',
    }
  },

  async signup(payload: SignupPayload): Promise<PendingSignup> {
    await delay(700)

    pendingSignups.set(payload.email.toLowerCase(), payload)
    return { email: payload.email }
  },

  async verifyEmailOtp({ email, code }: VerifyEmailOtpPayload): Promise<AuthSession> {
    await delay(500)

    if (code !== DEMO_OTP_CODE) {
      throw new AuthError('Incorrect verification code.')
    }

    const pending = pendingSignups.get(email.toLowerCase())
    if (!pending) {
      throw new AuthError('Your signup session expired. Please sign up again.')
    }
    pendingSignups.delete(email.toLowerCase())
    saveVerifiedSignup(email, pending)

    return {
      user: {
        id: `user_${Date.now()}`,
        email: pending.email,
        name: pending.email.split('@')[0] ?? pending.email,
        orgSlug: slugify(pending.companyName),
        orgName: pending.companyName,
        role: 'admin',
      },
      token: 'mock.jwt.token',
    }
  },

  async resendEmailOtp(_email: string): Promise<void> {
    await delay(500)
  },

  async requestPasswordReset(_email: string): Promise<void> {
    await delay(700)
  },
}
