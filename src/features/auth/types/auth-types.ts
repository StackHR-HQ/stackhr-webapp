export interface AuthUser {
  id: string
  email: string
  name: string
  organizationId: string
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
