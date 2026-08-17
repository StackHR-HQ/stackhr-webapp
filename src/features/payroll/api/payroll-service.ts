import { USE_MOCK_AUTH } from '../../../lib/env'
import { mockPayrollApi } from './payroll-mock-api'
import { payrollApi } from './payroll-api'

export const payrollService = USE_MOCK_AUTH ? mockPayrollApi : payrollApi
