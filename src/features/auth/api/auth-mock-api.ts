import { slugify } from '../../../lib/slugify'
import { AuthError, type AuthSession, type LoginPayload, type SignupPayload } from '../types/auth-types'

// Stands in for the real backend until the auth endpoints exist. Delays are
// simulated so loading states are actually visible while testing the flow.
const DEMO_ORG_SLUG = 'acme'
const DEMO_EMAIL = 'demo@stackhr.app'
const DEMO_PASSWORD = 'password123'

export const DEMO_LOGIN_CREDENTIALS = {
  orgSlug: DEMO_ORG_SLUG,
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const mockAuthApi = {
  async login({ orgSlug, email, password }: LoginPayload): Promise<AuthSession> {
    await delay(700)

    if (orgSlug.toLowerCase() !== DEMO_ORG_SLUG) {
      throw new AuthError(`We couldn't find a workspace called "${orgSlug}".`)
    }
    if (email.toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new AuthError('Incorrect email or password.')
    }

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
  },

  async signup({ companyName, email }: SignupPayload): Promise<AuthSession> {
    await delay(700)

    const orgSlug = slugify(companyName)
    return {
      user: {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0] ?? email,
        orgSlug,
        orgName: companyName,
        role: 'admin',
      },
      token: 'mock.jwt.token',
    }
  },

  async requestPasswordReset(_email: string): Promise<void> {
    await delay(700)
  },
}
