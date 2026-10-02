export interface AuthUser {
  id: string
  email: string
  name: string
  organizationId: string
  // Only set for business accounts (null for platform admins).
  orgSlug?: string | null
  orgName: string
  role: 'admin' | 'manager' | 'employee'
  apiRole?: string
}

export interface AuthSession {
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
  // Disambiguates which workspace to sign into when the email belongs to
  // more than one; optional for single-workspace accounts.
  orgSlug?: string
}

export interface SignupPayload {
  companyName: string
  organizationSlug?: string
  email: string
  password: string
  confirmPassword: string
}

export interface PendingSignup {
  email: string
}

export interface VerifyEmailOtpPayload {
  email: string
  code: string
}

export interface InvitationPreview {
  employeeName: string
  email: string
  organizationName: string
  expiresAt: string
  hasAccount: boolean
}

export interface AcceptInvitationPayload {
  token: string
  password: string
}

export interface ResetTokenStatus {
  valid: boolean
  email?: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export class AuthError extends Error {}
