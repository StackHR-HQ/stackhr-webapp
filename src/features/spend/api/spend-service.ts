import { USE_MOCK_AUTH } from '../../../lib/env'
import { mockSpendApi } from './spend-mock-api'
import { spendApi } from './spend-api'

export const spendService = USE_MOCK_AUTH ? mockSpendApi : spendApi
