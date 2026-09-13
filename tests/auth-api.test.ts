import { afterEach, describe, expect, test } from 'bun:test'
import type { InternalAxiosRequestConfig } from 'axios'
import { authApi } from '../src/features/auth/api/auth-api'
import { http } from '../src/lib/http'

const originalAdapter = http.defaults.adapter

function captureRequest() {
  let request: InternalAxiosRequestConfig | undefined

  http.defaults.adapter = async (config) => {
    request = config
    return {
      data: { user: { id: 'user-1' }, token: 'token-1' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }
  }

  return () => request
}

afterEach(() => {
  http.defaults.adapter = originalAdapter
})

describe('business authentication API', () => {
  test('sends workspace-aware login credentials to the business login route', async () => {
    const request = captureRequest()

    await authApi.login({
      orgSlug: 'acme-inc',
      email: 'ada@acme.com',
      password: 'correct horse battery staple',
    })

    expect(request()?.url).toBe('/auth/business/login')
    expect(JSON.parse(request()?.data as string)).toEqual({
      orgSlug: 'acme-inc',
      email: 'ada@acme.com',
      password: 'correct horse battery staple',
    })
  })

  test('uses the documented business signup and verification routes', async () => {
    const signupRequest = captureRequest()
    await authApi.signup({
      companyName: 'Acme Inc.',
      email: 'ada@acme.com',
      password: 'correct horse battery staple',
      confirmPassword: 'correct horse battery staple',
    })
    expect(signupRequest()?.url).toBe('/auth/business/signup')

    const verificationRequest = captureRequest()
    await authApi.verifyEmailOtp({ email: 'ada@acme.com', code: '123456' })
    expect(verificationRequest()?.url).toBe('/auth/business/verify-email')

    const resendRequest = captureRequest()
    await authApi.resendEmailOtp('ada@acme.com')
    expect(resendRequest()?.url).toBe('/auth/business/resend-verification')
  })
})
