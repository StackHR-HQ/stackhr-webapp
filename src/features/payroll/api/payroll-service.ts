import { USE_MOCK_PAYROLL } from '../../../lib/env'
import { mockPayrollApi } from './payroll-mock-api'
import { payrollApi } from './payroll-api'

export const payrollService = USE_MOCK_PAYROLL ? mockPayrollApi : payrollApi
