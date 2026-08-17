import { getRunMeta, PAYROLL_RUNS } from '../data/payroll-runs'
import { buildAuditLog, buildComplianceWarnings } from '../lib/compliance-and-audit'
import { getEmployeesAsOf } from '../lib/employees-as-of'
import { calculateRunLines, summarizeRun } from '../lib/payroll-calculation'
import { getStatutoryContributions } from '../lib/statutory-contributions'
import { TAX_RULE_SETS } from '../lib/tax-rules'
import type { PayrollOverview, PayrollRunDetail, PayrollRunListItem, PayrollRunMeta } from '../types/payroll-types'

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
}
