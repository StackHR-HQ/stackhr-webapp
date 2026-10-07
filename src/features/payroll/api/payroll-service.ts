import { USE_MOCK_PAYROLL, USE_MOCK_SPEND } from '../../../lib/env'
import { spendApi } from '../../spend/api/spend-api'
import { mockPayrollApi } from './payroll-mock-api'
import { payrollApi } from './payroll-api'

export const payrollService = {
  ...(USE_MOCK_PAYROLL ? mockPayrollApi : payrollApi),
  // Salary advances live under /spend on the backend, so they follow the spend mock flag.
  getSalaryAdvances: USE_MOCK_SPEND ? mockPayrollApi.getSalaryAdvances : spendApi.getSalaryAdvances,
}
