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
      if (!isCredentialCheck && !isPartnerCredentialError(error)) useAuthStore.getState().clearSession()
    }
    return Promise.reject(error)
  },
)

// The message the backend put in an error response, whichever envelope it used.
function responseMessage(error: unknown): string {
  if (!isAxiosError(error)) return ''
  const message: unknown = error.response?.data?.message ?? error.response?.data?.error?.message
  if (typeof message === 'string') return message
  if (Array.isArray(message)) return message.join(', ')
  return ''
}

// Stopgap: pension routes pass PenCentral's own 401 through when the backend's
// partner credentials are missing. That isn't an expired session, so it mustn't
// sign the user out. The backend should send a distinct status (502/424) or
// error code for upstream failures instead; until then this matches the
// /pension/ route and PenCentral's wording, in this one place.
export function isPartnerCredentialError(error: unknown): boolean {
  if (!isAxiosError(error) || error.response?.status !== 401) return false
  const url = error.config?.url ?? ''
  return url.startsWith('/pension/') && /partner credential/i.test(responseMessage(error))
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 429) return 'Too many attempts. Please wait a minute and try again.'
    if (!error.response) return "We couldn't reach the server. Check your connection and try again."
    if (error.response.status >= 500) return 'Something went wrong on our end. Please try again in a moment.'

    const message = responseMessage(error)
    if (message) return message
  }
  return fallback
}
