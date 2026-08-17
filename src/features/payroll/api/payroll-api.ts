import { http } from '../../../lib/http'
import type {
  BonusPayout,
  DeductionType,
  EarningComponent,
  EmployeeSalaryRow,
  PayrollOverview,
  PayrollRunDetail,
  PayrollRunListItem,
  PayslipRecord,
  SalaryAdvanceStatusEntry,
  SalaryBand,
  SalaryChangeEntry,
} from '../types/payroll-types'

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as payroll-mock-api.ts so payroll-service.ts can
// swap to this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const payrollApi = {
  async getRuns(): Promise<PayrollRunListItem[]> {
    const { data } = await http.get<PayrollRunListItem[]>('/payroll/runs')
    return data
  },

  async getRun(id: string): Promise<PayrollRunDetail | null> {
    const { data } = await http.get<PayrollRunDetail>(`/payroll/runs/${id}`)
    return data
  },

  async getOverview(): Promise<PayrollOverview> {
    const { data } = await http.get<PayrollOverview>('/payroll/overview')
    return data
  },

  async getSalaryBands(): Promise<SalaryBand[]> {
    const { data } = await http.get<SalaryBand[]>('/payroll/salaries/bands')
    return data
  },

  async getEmployeeSalaries(): Promise<EmployeeSalaryRow[]> {
    const { data } = await http.get<EmployeeSalaryRow[]>('/payroll/salaries/employees')
    return data
  },

  async getEarningComponents(): Promise<EarningComponent[]> {
    const { data } = await http.get<EarningComponent[]>('/payroll/salaries/allowances')
    return data
  },

  async getDeductionTypes(): Promise<DeductionType[]> {
    const { data } = await http.get<DeductionType[]>('/payroll/salaries/deductions')
    return data
  },

  async getBonusPayouts(): Promise<BonusPayout[]> {
    const { data } = await http.get<BonusPayout[]>('/payroll/salaries/bonuses')
    return data
  },

  async getSalaryChanges(): Promise<SalaryChangeEntry[]> {
    const { data } = await http.get<SalaryChangeEntry[]>('/payroll/salaries/changes')
    return data
  },

  async getSalaryAdvances(): Promise<SalaryAdvanceStatusEntry[]> {
    const { data } = await http.get<SalaryAdvanceStatusEntry[]>('/payroll/salary-advances')
    return data
  },

  async getPayslips(): Promise<PayslipRecord[]> {
    const { data } = await http.get<PayslipRecord[]>('/payroll/payslips')
    return data
  },
}
