export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

// Flip VITE_USE_MOCK_AUTH=false once the auth endpoints exist on the backend.
const useMockAuthFlag = import.meta.env.VITE_USE_MOCK_AUTH
export const USE_MOCK_AUTH = useMockAuthFlag !== 'false'
