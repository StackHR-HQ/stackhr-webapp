import { getApiErrorMessage, http } from '../../../lib/http'
import { slugify } from '../../../lib/slugify'
import {
  AuthError,
  type AuthSession,
  type AuthUser,
  type LoginPayload,
  type PendingSignup,
  type SignupPayload,
  type VerifyEmailOtpPayload,
} from '../types/auth-types'

interface ApiUser {
  id: string
  name: string
  email: string
  userType: string
  role: string
  backendRole?: string
  organizationId: string
  orgName?: string
}

function toUiRole(apiRole: string): AuthUser['role'] {
  if (/owner|admin/i.test(apiRole)) return 'admin'
  if (/manager/i.test(apiRole)) return 'manager'
  return 'employee'
}

function toAuthUser(user: ApiUser): AuthUser {
  const apiRole = user.backendRole ?? user.role
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    organizationId: user.organizationId,
    orgName: user.orgName ?? user.name,
    role: toUiRole(apiRole),
    apiRole,
  }
}

async function request<T>(call: () => Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await call()
    return data
  } catch (error) {
    throw new AuthError(getApiErrorMessage(error))
  }
}

export const authApi = {
  async login({ email, password }: LoginPayload): Promise<AuthSession> {
    const data = await request(() => http.post<{ user: ApiUser }>('/auth/business/login', { email, password }))
    return { user: toAuthUser(data.user) }
  },

  async signup({ companyName, email, password }: SignupPayload): Promise<PendingSignup> {
    const data = await request(() =>
      http.post<{ email: string }>('/auth/business/register', {
        email,
        password,
        confirmPassword: password,
        companyName,
        organizationSlug: slugify(companyName),
      }),
    )
    return { email: data.email }
  },

  async verifyEmailOtp({ email, code }: VerifyEmailOtpPayload): Promise<AuthSession> {
    const data = await request(() => http.post<{ user: ApiUser }>('/auth/business/verify-email', { email, code }))
    return { user: toAuthUser(data.user) }
  },

  async switchOrganization(organizationId: string): Promise<AuthSession> {
    const data = await request(() => http.post<{ user: ApiUser }>('/auth/switch-organization', { organizationId }))
    return { user: toAuthUser(data.user) }
  },

  async getCurrentUser(): Promise<AuthSession> {
    const { data } = await http.get<{ user: ApiUser }>('/auth/me')
    return { user: toAuthUser(data.user) }
  },

  async resendEmailOtp(email: string): Promise<void> {
    await request(() => http.post('/auth/business/resend-verification', { email }))
  },

  async requestPasswordReset(_email: string): Promise<void> {
    throw new AuthError('Password reset isn’t available yet. Please contact support.')
  },
}
