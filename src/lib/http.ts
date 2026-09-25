import axios, { isAxiosError } from 'axios'
import { useAuthStore } from '../features/auth/store/auth-store'
import { API_BASE_URL } from './env'

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

interface ApiEnvelope {
  success: boolean
  message: string
  data: unknown
}

function isEnvelope(body: unknown): body is ApiEnvelope {
  return typeof body === 'object' && body !== null && 'success' in body && 'data' in body
}

http.interceptors.response.use(
  (response) => {
    if (isEnvelope(response.data)) {
      response.data = response.data.data
    }
    return response
  },
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      // /auth/* returns 401 for bad credentials, which isn't an expired session
      const url = error.config?.url ?? ''
      const isCredentialCheck = url.startsWith('/auth/') && url !== '/auth/me'
      if (!isCredentialCheck) useAuthStore.getState().clearSession()
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 429) return 'Too many attempts. Please wait a minute and try again.'
    if (!error.response) return "We couldn't reach the server. Check your connection and try again."
    if (error.response.status >= 500) return 'Something went wrong on our end. Please try again in a moment.'

    const message: unknown = error.response.data?.message ?? error.response.data?.error?.message
    if (typeof message === 'string' && message) return message
    if (Array.isArray(message) && message.length > 0) return message.join(', ')
  }
  return fallback
}
