import { USE_MOCK_AUTH } from '../../lib/env'
import { authApi } from './api'
import { mockAuthApi } from './mock-api'

export const authService = USE_MOCK_AUTH ? mockAuthApi : authApi
