import { USE_MOCK_PAYROLL, USE_MOCK_SPEND } from '../../../lib/env'
import { spendApi } from '../../spend/api/spend-api'
import { mockPayrollApi } from './payroll-mock-api'
import { payrollApi } from './payroll-api'

export const payrollService = {
  // Runs, salaries and payslips come from the backend. Bonuses, deduction
  // types, tax rule sets and the compliance view of a run have no backend
  // data yet, so they stay on mock data.
  ...mockPayrollApi,
  ...(USE_MOCK_PAYROLL ? {} : payrollApi),
  getComplianceOverview: mockPayrollApi.getOverview,
  // Salary advances live under /spend on the backend, so they follow the spend mock flag.
  getSalaryAdvances: USE_MOCK_SPEND ? mockPayrollApi.getSalaryAdvances : spendApi.getSalaryAdvances,
}
