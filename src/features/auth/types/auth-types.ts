export interface AuthUser {
  id: string
  email: string
  name: string
  orgSlug: string
  orgName: string
  role: 'admin' | 'manager' | 'employee'
}

export interface AuthSession {
  user: AuthUser
  token: string
}

export interface LoginPayload {
  orgSlug: string
  email: string
  password: string
}

export interface SignupPayload {
  companyName: string
  email: string
  password: string
}

export interface PendingSignup {
  email: string
}

export interface VerifyEmailOtpPayload {
  email: string
  code: string
}

export class AuthError extends Error {}
