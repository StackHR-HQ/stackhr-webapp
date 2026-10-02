import { getApiErrorMessage, http } from '../../../lib/http'
import {
  AuthError,
  type AcceptInvitationPayload,
  type AuthSession,
  type AuthUser,
  type ChangePasswordPayload,
  type InvitationPreview,
  type LoginPayload,
  type PendingSignup,
  type ResetPasswordPayload,
  type ResetTokenStatus,
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
  orgSlug?: string | null
  orgName?: string | null
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
    orgSlug: user.orgSlug,
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
    throw new AuthError(getApiErrorMessage(error, 'Something went wrong. Please try again.'))
  }
}

export const authApi = {
  async login({ email, password, orgSlug }: LoginPayload): Promise<AuthSession> {
    const data = await request(() =>
      http.post<{ user: ApiUser }>('/auth/business/login', { email, password, orgSlug: orgSlug || undefined }),
    )
    return { user: toAuthUser(data.user) }
  },

  async signup({ companyName, organizationSlug, email, password, confirmPassword }: SignupPayload): Promise<PendingSignup> {
    const data = await request(() =>
      http.post<{ email: string }>('/auth/business/signup', {
        companyName,
        organizationSlug,
        email,
        password,
        confirmPassword,
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

  async requestPasswordReset(email: string): Promise<void> {
    await request(() => http.post('/auth/forgot-password', { email }))
  },

  async previewInvitation(token: string): Promise<InvitationPreview> {
    return request(() => http.get<InvitationPreview>(`/auth/invitations/${encodeURIComponent(token)}`))
  },

  async acceptInvitation({ token, password }: AcceptInvitationPayload): Promise<AuthSession | null> {
    const data = await request(() => http.post<{ user?: ApiUser } | null>('/auth/invitations/accept', { token, password }))
    return data?.user ? { user: toAuthUser(data.user) } : null
  },

  async verifyResetToken(token: string): Promise<ResetTokenStatus> {
    return request(() => http.get<ResetTokenStatus>('/auth/reset-password/verify', { params: { token } }))
  },

  async resetPassword({ token, password, confirmPassword }: ResetPasswordPayload): Promise<void> {
    await request(() => http.post('/auth/reset-password', { token, password, confirmPassword }))
  },

  async changePassword({ currentPassword, newPassword, confirmPassword }: ChangePasswordPayload): Promise<void> {
    await request(() => http.post('/auth/change-password', { currentPassword, newPassword, confirmPassword }))
  },

  async logout(): Promise<void> {
    await request(() => http.post('/auth/logout'))
  },
}
