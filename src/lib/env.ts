const rawApiBaseUrl: string = import.meta.env.VITE_API_BASE_URL ?? '/api'


export const API_BASE_URL =
  import.meta.env.DEV && /^https?:\/\//.test(rawApiBaseUrl) ? new URL(rawApiBaseUrl).pathname : rawApiBaseUrl


const isMocked = (flag: string | undefined) => flag !== 'false'

export const USE_MOCK_SETTINGS = isMocked(import.meta.env.VITE_USE_MOCK_SETTINGS)
export const USE_MOCK_PAYROLL = isMocked(import.meta.env.VITE_USE_MOCK_PAYROLL)
export const USE_MOCK_SPEND = isMocked(import.meta.env.VITE_USE_MOCK_SPEND)
export const USE_MOCK_DASHBOARD = isMocked(import.meta.env.VITE_USE_MOCK_DASHBOARD)
