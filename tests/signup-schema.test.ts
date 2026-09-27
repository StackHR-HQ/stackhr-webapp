import { describe, expect, test } from 'bun:test'
import { signupSchema } from '../src/features/auth/schemas/signup-schema'

const validSignup = {
  companyName: 'Acme Inc.',
  email: 'ada@acme.com',
  password: 'correct horse battery staple',
  confirmPassword: 'correct horse battery staple',
}

describe('signup validation', () => {
  test('accepts a 12-character password', () => {
    expect(signupSchema.safeParse({ ...validSignup, password: '123456789012', confirmPassword: '123456789012' }).success).toBe(true)
  })

  test('rejects passwords shorter than 12 characters', () => {
    const result = signupSchema.safeParse({ ...validSignup, password: '12345678901', confirmPassword: '12345678901' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Password must be at least 12 characters')
    }
  })
})
