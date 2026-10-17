import { USE_MOCK_PAYROLL, USE_MOCK_SPEND } from '../../../lib/env'
import { spendApi } from '../../spend/api/spend-api'
import { mockPayrollApi } from './payroll-mock-api'
import { payrollApi } from './payroll-api'

export const payrollService = {
  // Bonuses and deduction types have no backend yet; with real data their tabs show Coming soon.
  ...mockPayrollApi,
  ...(USE_MOCK_PAYROLL ? {} : payrollApi),
  // Salary advances live under /spend on the backend, so they follow the spend mock flag.
  getSalaryAdvances: USE_MOCK_SPEND ? mockPayrollApi.getSalaryAdvances : spendApi.getSalaryAdvances,
}
