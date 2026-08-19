import { DEDUCTION_TYPES } from '../data/deduction-types'
import { getRunMeta, PAYROLL_RUNS } from '../data/payroll-runs'
import { SALARY_CHANGES } from '../data/salary-changes'
import { getBonusPayouts as computeBonusPayouts } from '../lib/bonuses'
import { buildAuditLog, buildComplianceWarnings } from '../lib/compliance-and-audit'
import { EARNING_COMPONENTS } from '../lib/earning-structure'
import { getEmployeesAsOf } from '../lib/employees-as-of'
import { calculateRunLines, summarizeRun } from '../lib/payroll-calculation'
import { getPayslips as computePayslips } from '../lib/payslips'
import { getSalaryAdvances as computeSalaryAdvances } from '../lib/salary-advances'
import { getEmployeeSalaryRows, getSalaryBands as computeSalaryBands } from '../lib/salary-bands'
import { getStatutoryContributions } from '../lib/statutory-contributions'
import { TAX_RULE_SETS } from '../lib/tax-rules'
import type {
  BonusPayout,
  DeductionType,
  EarningComponent,
  EmployeeSalaryRow,
  PayrollOverview,
  PayrollRunDetail,
  PayrollRunListItem,
  PayrollRunMeta,
  PayslipRecord,
  SalaryAdvanceStatusEntry,
  SalaryBand,
  SalaryChangeEntry,
  TaxRuleSet,
} from '../types/payroll-types'

const CURRENT_RUN_ID = 'run-2026-08'
const CURRENCY = 'NGN'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildRunDetail(meta: PayrollRunMeta): PayrollRunDetail {
  const employees = getEmployeesAsOf(meta.payDate)
  const statutoryContributions = getStatutoryContributions(employees.length)
  const lines = calculateRunLines(employees, meta.taxRuleSetId, statutoryContributions)

  return {
    ...meta,
    taxRuleSet: TAX_RULE_SETS[meta.taxRuleSetId],
    summary: summarizeRun(lines, CURRENCY),
    statutoryContributions,
    lines,
    complianceWarnings: buildComplianceWarnings(meta),
    auditLog: buildAuditLog(meta),
  }
}

export const mockPayrollApi = {
  async getRuns(): Promise<PayrollRunListItem[]> {
    await delay(400)
    return [...PAYROLL_RUNS]
      .sort((a, b) => new Date(b.payDate).getTime() - new Date(a.payDate).getTime())
      .map((meta) => {
        const employees = getEmployeesAsOf(meta.payDate)
        const statutoryContributions = getStatutoryContributions(employees.length)
        const lines = calculateRunLines(employees, meta.taxRuleSetId, statutoryContributions)
        return { ...meta, summary: summarizeRun(lines, CURRENCY) }
      })
  },

  async getRun(id: string): Promise<PayrollRunDetail | null> {
    await delay(400)
    const meta = getRunMeta(id)
    return meta ? buildRunDetail(meta) : null
  },

  async getOverview(): Promise<PayrollOverview> {
    await delay(400)
    const currentMeta = getRunMeta(CURRENT_RUN_ID)!
    const currentRun = buildRunDetail(currentMeta)

    const previousRuns = PAYROLL_RUNS.filter((run) => run.status === 'completed')
      .sort((a, b) => new Date(b.payDate).getTime() - new Date(a.payDate).getTime())
      .slice(0, 6)

    const upcomingRuns = PAYROLL_RUNS.filter((run) => run.status === 'draft').sort(
      (a, b) => new Date(a.payDate).getTime() - new Date(b.payDate).getTime(),
    )

    return {
      currentRun,
      previousRuns,
      upcomingRuns,
      complianceWarnings: currentRun.complianceWarnings,
    }
  },

  async getSalaryBands(): Promise<SalaryBand[]> {
    await delay(300)
    return computeSalaryBands()
  },

  async getEmployeeSalaries(): Promise<EmployeeSalaryRow[]> {
    await delay(300)
    return getEmployeeSalaryRows()
  },

  async getEarningComponents(): Promise<EarningComponent[]> {
    await delay(200)
    return EARNING_COMPONENTS
  },

  async getDeductionTypes(): Promise<DeductionType[]> {
    await delay(200)
    return DEDUCTION_TYPES
  },

  async getBonusPayouts(): Promise<BonusPayout[]> {
    await delay(300)
    return computeBonusPayouts()
  },

  async getSalaryChanges(): Promise<SalaryChangeEntry[]> {
    await delay(300)
    return [...SALARY_CHANGES].sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())
  },

  async getSalaryAdvances(): Promise<SalaryAdvanceStatusEntry[]> {
    await delay(300)
    return computeSalaryAdvances()
  },

  async getPayslips(): Promise<PayslipRecord[]> {
    await delay(300)
    return computePayslips()
  },

  async getTaxRuleSets(): Promise<TaxRuleSet[]> {
    await delay(200)
    return Object.values(TAX_RULE_SETS)
  },
}
