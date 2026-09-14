import { isAxiosError } from 'axios'

type ApiErrorBody = {
  message?: string | string[]
  error?: { message?: string | string[] }
}

function messageFrom(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data
    return messageFrom(body?.error?.message) ?? messageFrom(body?.message) ?? error.message ?? fallback
  }
  return error instanceof Error ? error.message : fallback
}
