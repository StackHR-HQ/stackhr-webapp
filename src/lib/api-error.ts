import { isAxiosError } from 'axios'

type ApiErrorBody = { error?: { message?: string } }

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? error.message ?? fallback
  }
  return error instanceof Error ? error.message : fallback
}
