import { USE_MOCK_AUTH } from '../../../lib/env'
import { authApi } from './auth-api'
import { mockAuthApi } from './auth-mock-api'

export const authService = USE_MOCK_AUTH ? mockAuthApi : authApi
