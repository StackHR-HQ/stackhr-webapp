import { USE_MOCK_SPEND } from '../../../lib/env'
import { mockSpendApi } from './spend-mock-api'
import { spendApi } from './spend-api'

export const spendService = USE_MOCK_SPEND ? mockSpendApi : spendApi
