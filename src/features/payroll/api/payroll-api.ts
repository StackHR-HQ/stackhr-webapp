import { toApiEnum } from '../../../lib/api-enum'
import { http } from '../../../lib/http'
import type { ApprovalRequest } from '../../approvals/types/approval-request-types'
import { humanizeEnum, initials } from '../../employee/lib/profile-format'
import { peopleApi } from '../../people/api/people-api'
import { EARNING_COMPONENTS } from '../lib/earning-structure'
import { summarizeRun } from '../lib/payroll-calculation'
import type {
  AuditLogEntry,
  ComplianceOverview,
  ComplianceWarning,
  EarningComponent,
  EmployeeSalaryRow,
  PayrollOverview,
  PayrollRunDetail,
  PayrollRunListItem,
  PayrollRunMeta,
  PayrollRunStage,
  PayrollRunStatus,
  PayrollRunSummary,
  PayslipRecord,
  RunEmployeeLine,
  SalaryBand,
  SalaryChangeEntry,
  StatutoryApplicability,
  StatutoryContributionRule,
  TaxRuleSet,
} from '../types/payroll-types'

// Shapes confirmed against staging. Run, item, payslip and compensation
// amounts are whole currency units per month; annualSalaryMinor and the
// compensation history's previousSalary / newSalary are kobo per year.
interface ApiPayrollRun {
  id: string
  periodMonth: number
  periodYear: number
  title: string
  status: string
  currency: string
  payrollEngineVersion: string | null
  taxRuleSetId: string | null
  employeeCount: number
  totalGross: number
  totalTax: number
  totalPension: number
  totalNhf: number
  totalOtherDeductions: number
  totalEmployerPension: number
  totalNet: number
  approvedAt: string | null
  executedAt: string | null
  reconciledAt: string | null
  payDate: string
  // The admin's display name or email.
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface ApiPayrollRunItem {
  id: string
  employeeId: string
  employee: { id: string; fullName: string; email?: string; department?: string | null; jobTitle?: string | null } | null
  basicSalary: number
  housingAllowance: number
  transportAllowance: number
  otherAllowances: number
  grossSalary: number
  taxDeduction: number
  pensionDeduction: number
  employerPensionDeduction: number
  nhfDeduction: number
  otherDeductions: number
  netSalary: number
}

// Same shape as an organization compliance alert. Only returned while a run is DRAFT or CALCULATED.
interface ApiComplianceAlert {
  type: string
  title?: string
  severity: string
  message: string
  count?: number
  dueDate?: string
}

interface ApiAuditEvent {
  id: string
  action: string
  description: string
  createdAt: string
  actor: { id: string; name: string | null; email: string } | null
}

interface ApiPayrollRunDetail extends ApiPayrollRun {
  items: ApiPayrollRunItem[]
  rejectionReason?: string | null
  complianceWarnings?: ApiComplianceAlert[]
  auditTrail?: ApiAuditEvent[]
}

// Created for every item when a run is approved.
interface ApiPayslip {
  id: string
  payrollRunId: string
  employeeId: string
  periodMonth: number
  periodYear: number
  netSalary: number
  employee: { id: string; fullName: string } | null
}

// GET /payroll/compensation: each employee's current compensation.
interface ApiCompensation {
  employeeId: string
  fullName: string
  jobTitle: string | null
  department: string | null
  currency: string
  paymentFrequency: string
  basicSalary: number
  housingAllowance: number
  transportAllowance: number
  otherAllowances: number
  grossMonthlySalary: number
}

// GET /people/employees/:id/compensation-history. An employee's first
// salary is recorded with previousSalary 0.
interface ApiCompensationChange {
  id: string
  effectiveDate: string
  previousSalary: number
  newSalary: number
  reason: string | null
  currency: string | null
}

// Which statutory contributions apply. `basis` lists the pay components a rate applies to.
interface ApiStatutoryRule {
  rate?: number
  employeeRate?: number
  employerRate?: number
  basis?: string
  mandatory?: boolean
  voluntary?: boolean
  mandatoryThreshold?: number
  voluntaryBelowThreshold?: boolean
  // ITF also applies from this annual turnover, in kobo.
  turnoverThresholdMinor?: number
  legalBasis: string
  // Written for developers (it names API fields), so explanations are built here instead.
  note: string
}

// GET /compliance/active-rule-set. Rates are fractions (0.08 = 8%); limits are naira per year.
interface ApiActiveRuleSet {
  id: string
  name: string
  effectiveFrom: string
  taxFreeThreshold: number
  rentReliefPercentage: number
  rentReliefCap: number
  pensionEmployeeRate: number
  pensionEmployerRate: number
  nhfRate: number
  taxRules: { bandOrder: number; lowerLimit: number; upperLimit: number | null; taxRate: number }[]
  applicability?: Partial<Record<StatutoryContributionRule['id'], ApiStatutoryRule>>
}

// Backend lifecycle: DRAFT → CALCULATED → PENDING_APPROVAL → APPROVED | REJECTED
// → FUNDING_CHECK_PASSED | FUNDING_SHORTFALL → EXECUTED → RECONCILED.
const RUN_STATUS: Record<string, PayrollRunStatus> = {
  DRAFT: 'draft',
  CALCULATED: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  FUNDING_CHECK_PASSED: 'approved',
  EXECUTED: 'processing',
  RECONCILED: 'completed',
  REJECTED: 'failed',
  FUNDING_SHORTFALL: 'failed',
}

const FUNDING_SHORTFALL_REASON = 'The funding check found a shortfall. Fund the account, then attest funding again.'

function toRunMeta(run: ApiPayrollRun & { rejectionReason?: string | null }): PayrollRunMeta {
  const status = toApiEnum(run.status)
  const periodStart = new Date(run.periodYear, run.periodMonth - 1, 1)
  const periodEnd = new Date(run.periodYear, run.periodMonth, 0)
  return {
    id: run.id,
    periodLabel: periodStart.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    payPeriodStart: periodStart.toISOString(),
    payPeriodEnd: periodEnd.toISOString(),
    payDate: run.payDate,
    status: RUN_STATUS[status] ?? 'draft',
    stage: status as PayrollRunStage,
    taxRuleSetId: run.taxRuleSetId ?? undefined,
    payrollEngineVersion: run.payrollEngineVersion ?? undefined,
    generatedBy: run.createdBy ?? undefined,
    generatedAt: run.createdAt,
    approvedAt: run.approvedAt ?? undefined,
    failureReason:
      status === 'REJECTED'
        ? (run.rejectionReason ?? 'This payroll run was rejected during approval.')
        : status === 'FUNDING_SHORTFALL'
          ? FUNDING_SHORTFALL_REASON
          : undefined,
  }
}

function toRunSummary(run: ApiPayrollRun): PayrollRunSummary {
  return {
    employeeCount: run.employeeCount,
    currency: run.currency,
    grossPay: run.totalGross,
    totalEmployeeDeductions: run.totalTax + run.totalPension + run.totalNhf + run.totalOtherDeductions,
    totalEmployerContributions: run.totalEmployerPension,
    netPay: run.totalNet,
    totalEmployerCost: run.totalGross + run.totalEmployerPension,
  }
}

function toRunLine(item: ApiPayrollRunItem): RunEmployeeLine {
  const name = item.employee?.fullName ?? 'Unknown employee'
  return {
    employeeId: item.employeeId,
    employeeName: name,
    avatarInitials: initials(name),
    jobTitle: item.employee?.jobTitle ?? '',
    basic: item.basicSalary,
    housing: item.housingAllowance,
    transport: item.transportAllowance,
    otherAllowances: item.otherAllowances,
    grossPay: item.grossSalary,
    paye: item.taxDeduction,
    pensionEmployee: item.pensionDeduction,
    nhfEmployee: item.nhfDeduction,
    totalDeductions: item.taxDeduction + item.pensionDeduction + item.nhfDeduction + item.otherDeductions,
    netPay: item.netSalary,
    pensionEmployer: item.employerPensionDeduction,
    // NHIA and NSITF are planned for the engine's next statutory phase.
    nhiaEmployer: 0,
    nsitfEmployer: 0,
    totalEmployerContributions: item.employerPensionDeduction,
    employerCost: item.grossSalary + item.employerPensionDeduction,
  }
}

const SEVERITY: Record<string, ComplianceWarning['severity']> = {
  CRITICAL: 'critical',
  HIGH: 'critical',
  MEDIUM: 'warning',
  LOW: 'info',
  INFO: 'info',
}

function toComplianceWarnings(alerts: ApiComplianceAlert[], idPrefix: string): ComplianceWarning[] {
  return alerts.map((alert) => ({
    id: `${idPrefix}-${alert.type}`,
    severity: SEVERITY[toApiEnum(alert.severity)] ?? 'warning',
    message: alert.message,
  }))
}

function toAuditLogEntry(event: ApiAuditEvent): AuditLogEntry {
  return {
    id: event.id,
    actor: event.actor?.name ?? event.actor?.email ?? 'System',
    action: event.description,
    timestamp: event.createdAt,
  }
}

const STATUTORY_NAMES: Record<StatutoryContributionRule['id'], string> = {
  pension: 'Pension (RSA)',
  nhf: 'National Housing Fund',
  nhia: 'Health Insurance (NHIA)',
  nsitf: 'Employee Compensation (NSITF)',
  itf: 'Industrial Training Fund',
}

const STATUTORY_ORDER: StatutoryContributionRule['id'][] = ['pension', 'nhf', 'nhia', 'nsitf', 'itf']

// A single `rate` is paid by the employee for NHF and by the employer for the rest.
const EMPLOYEE_FUNDED: StatutoryContributionRule['id'][] = ['nhf']

function toContributionBase(basis: string | undefined): StatutoryContributionRule['base'] {
  if (basis === 'BASIC') return 'basic'
  if (basis === 'GROSS' || !basis) return 'gross'
  return 'bht'
}

// The backend doesn't know turnover, so a headcount threshold alone decides.
function toApplicability(rule: ApiStatutoryRule, employeeCount: number): StatutoryApplicability {
  if (rule.mandatoryThreshold !== undefined) {
    if (employeeCount >= rule.mandatoryThreshold) return 'mandatory'
    return rule.voluntaryBelowThreshold ? 'voluntary' : 'not_applicable'
  }
  if (rule.voluntary) return 'voluntary'
  return rule.mandatory ? 'mandatory' : 'not_applicable'
}

const toPercent = (rate: number) => Math.round(rate * 1000) / 10

const employeesLabel = (count: number) => `${count} ${count === 1 ? 'employee' : 'employees'}`

function explainContribution(
  id: StatutoryContributionRule['id'],
  rule: ApiStatutoryRule,
  applicability: StatutoryApplicability,
  employeeCount: number,
): string {
  const threshold = rule.mandatoryThreshold ?? 0
  const yours = `Your organization has ${employeesLabel(employeeCount)}`
  switch (id) {
    case 'pension':
      return applicability === 'mandatory'
        ? `Mandatory for employers with ${threshold} or more employees. ${yours}, so contributions are required for every employee who isn't exempt.`
        : `Mandatory from ${threshold} employees and voluntary below that. ${yours}.`
    case 'nhf':
      return applicability === 'mandatory'
        ? 'Mandatory for eligible employees, deducted from basic salary.'
        : 'Voluntary. Employees who opt in contribute from their basic salary.'
    case 'nsitf':
      return 'Employer-funded cover for workplace injury and compensation, required once you have any employees.'
    case 'itf': {
      const turnover = rule.turnoverThresholdMinor ? ` or annual turnover of ${naira(rule.turnoverThresholdMinor / 100)}` : ''
      return applicability === 'mandatory'
        ? `Required for employers with ${threshold} or more employees${turnover}. ${yours}.`
        : `Required from ${threshold} employees${turnover}. ${yours}, so it applies only if your turnover meets the threshold.`
    }
    case 'nhia':
      return 'Mandatory health insurance under the National Health Insurance Authority. Contribution rates are agreed with your health plan.'
  }
}

function toStatutoryContributions(ruleSet: ApiActiveRuleSet, employeeCount: number): StatutoryContributionRule[] {
  return STATUTORY_ORDER.flatMap((id) => {
    const rule = ruleSet.applicability?.[id]
    if (!rule) return []
    const employeeFunded = EMPLOYEE_FUNDED.includes(id)
    const applicability = toApplicability(rule, employeeCount)
    return [
      {
        id,
        name: STATUTORY_NAMES[id],
        applicability,
        employeeRatePercent: toPercent(rule.employeeRate ?? (employeeFunded ? (rule.rate ?? 0) : 0)),
        employerRatePercent: toPercent(rule.employerRate ?? (employeeFunded ? 0 : (rule.rate ?? 0))),
        base: toContributionBase(rule.basis),
        explanation: explainContribution(id, rule, applicability, employeeCount),
        legalReference: rule.legalBasis,
      },
    ]
  })
}

// The active rule set only describes a run calculated with it.
function toRunDetail(run: ApiPayrollRunDetail, ruleSet?: ApiActiveRuleSet): PayrollRunDetail {
  const lines = run.items.map(toRunLine)
  const runRuleSet = ruleSet && ruleSet.id === run.taxRuleSetId ? ruleSet : undefined
  return {
    ...toRunMeta(run),
    taxRuleSet: runRuleSet ? toTaxRuleSet(runRuleSet) : undefined,
    summary: summarizeRun(lines, run.currency),
    statutoryContributions: runRuleSet ? toStatutoryContributions(runRuleSet, lines.length) : [],
    complianceWarnings: toComplianceWarnings(run.complianceWarnings ?? [], run.id),
    auditLog: (run.auditTrail ?? []).map(toAuditLogEntry),
    lines,
  }
}

const toListItem = (run: ApiPayrollRun): PayrollRunListItem => ({ ...toRunMeta(run), summary: toRunSummary(run) })

async function fetchRuns(): Promise<ApiPayrollRun[]> {
  const { data } = await http.get<{ payrollRuns: ApiPayrollRun[] }>('/payroll/runs')
  return data.payrollRuns.toSorted((a, b) => b.payDate.localeCompare(a.payDate))
}

async function fetchRun(id: string): Promise<ApiPayrollRunDetail> {
  const { data } = await http.get<{ payrollRun: ApiPayrollRunDetail }>(`/payroll/runs/${id}`)
  return data.payrollRun
}

async function fetchActiveRuleSet(): Promise<ApiActiveRuleSet> {
  const { data } = await http.get<ApiActiveRuleSet>('/compliance/active-rule-set')
  return data
}

async function fetchComplianceAlerts(): Promise<ComplianceWarning[]> {
  const { data } = await http.get<{ alerts: ApiComplianceAlert[] }>('/compliance/alerts')
  return toComplianceWarnings(data.alerts, 'org')
}

// The run's own warnings come first; organization alerts that repeat one are dropped.
function mergeWarnings(runWarnings: ComplianceWarning[], orgWarnings: ComplianceWarning[]): ComplianceWarning[] {
  const messages = new Set(runWarnings.map((warning) => warning.message))
  return [...runWarnings, ...orgWarnings.filter((warning) => !messages.has(warning.message))]
}

const naira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`
const percent = (rate: number) => `${Math.round(rate * 1000) / 10}%`

function toTaxRuleSet(ruleSet: ApiActiveRuleSet): TaxRuleSet {
  const rates = ruleSet.taxRules.map((band) => band.taxRate)
  return {
    id: ruleSet.id,
    // The backend has no separate version; the rule set ID identifies it.
    version: ruleSet.id,
    effectiveFrom: ruleSet.effectiveFrom,
    label: ruleSet.name,
    description:
      `The first ${naira(ruleSet.taxFreeThreshold)} of yearly income is tax-free. ` +
      `${ruleSet.taxRules.length} progressive bands run from ${percent(Math.min(...rates))} to ${percent(Math.max(...rates))}, ` +
      `with rent relief of ${percent(ruleSet.rentReliefPercentage)} of rent paid, up to ${naira(ruleSet.rentReliefCap)} a year.`,
  }
}

async function fetchCompensation(): Promise<ApiCompensation[]> {
  const { data } = await http.get<{ compensations: ApiCompensation[] }>('/payroll/compensation')
  return data.compensations
}

async function getEmployeeSalaryRows(): Promise<EmployeeSalaryRow[]> {
  return (await fetchCompensation()).map((compensation) => ({
    employeeId: compensation.employeeId,
    employeeName: compensation.fullName,
    avatarInitials: initials(compensation.fullName),
    jobTitle: compensation.jobTitle ?? '',
    // Compensation carries the department's name, not its ID.
    departmentId: compensation.department ?? '',
    annualSalary: compensation.grossMonthlySalary * 12,
    monthlySalary: compensation.grossMonthlySalary,
    currency: compensation.currency,
    payFrequency: humanizeEnum(compensation.paymentFrequency),
  }))
}

export const payrollApi = {
  async getRuns(): Promise<PayrollRunListItem[]> {
    return (await fetchRuns()).map(toListItem)
  },

  async getRun(id: string): Promise<PayrollRunDetail | null> {
    const [apiRun, ruleSet] = await Promise.all([fetchRun(id), fetchActiveRuleSet()])
    const run = toRunDetail(apiRun, ruleSet)
    if (run.status !== 'pending_approval') return run
    const { data } = await http.get<{ items: ApprovalRequest[] }>('/approvals', {
      params: { type: 'PAYROLL', status: 'PENDING', page: 1, limit: 100 },
    })
    const approval = data.items.find((item) => item.subjectId === id)
    return { ...run, approvalId: approval?.id, approvalRequesterId: approval?.requesterId }
  },

  // No overview endpoint: the current run is the latest one not yet completed,
  // falling back to the latest run.
  async getOverview(): Promise<PayrollOverview> {
    const [runs, ruleSet, alerts] = await Promise.all([fetchRuns(), fetchActiveRuleSet(), fetchComplianceAlerts()])
    const current = runs.find((run) => RUN_STATUS[toApiEnum(run.status)] !== 'completed') ?? runs[0]
    const items = runs.map(toListItem)
    const currentRun = current ? toRunDetail(await fetchRun(current.id), ruleSet) : null
    return {
      currentRun,
      previousRuns: items.filter((run) => run.status === 'completed').slice(0, 6),
      upcomingRuns: items.filter((run) => run.status === 'draft' && run.id !== current?.id).reverse(),
      complianceWarnings: mergeWarnings(currentRun?.complianceWarnings ?? [], alerts),
    }
  },

  // Which contributions apply depends on the organization's current headcount.
  async getComplianceOverview(): Promise<ComplianceOverview> {
    const [ruleSet, employees, runs, alerts] = await Promise.all([
      fetchActiveRuleSet(),
      peopleApi.getEmployees(),
      fetchRuns(),
      fetchComplianceAlerts(),
    ])
    const current = runs.find((run) => RUN_STATUS[toApiEnum(run.status)] !== 'completed') ?? runs[0]
    const currentRun = current ? toRunDetail(await fetchRun(current.id), ruleSet) : null
    return {
      taxRuleSet: toTaxRuleSet(ruleSet),
      statutoryContributions: toStatutoryContributions(ruleSet, employees.length),
      currentRun,
      complianceWarnings: mergeWarnings(currentRun?.complianceWarnings ?? [], alerts),
    }
  },

  // Org admins can only read the active rule set.
  async getTaxRuleSets(): Promise<TaxRuleSet[]> {
    return [toTaxRuleSet(await fetchActiveRuleSet())]
  },

  getEmployeeSalaries: getEmployeeSalaryRows,

  async getSalaryBands(): Promise<SalaryBand[]> {
    const byDepartment = new Map<string, EmployeeSalaryRow[]>()
    for (const row of await getEmployeeSalaryRows()) {
      if (row.departmentId) byDepartment.set(row.departmentId, [...(byDepartment.get(row.departmentId) ?? []), row])
    }
    return [...byDepartment].map(([department, members]) => {
      const salaries = members.map((row) => row.annualSalary)
      return {
        departmentId: department,
        departmentName: department,
        employeeCount: salaries.length,
        minSalary: Math.min(...salaries),
        maxSalary: Math.max(...salaries),
        avgSalary: salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length,
      }
    })
  },

  // No configured structure exists, so each component's share comes from
  // employees' current compensation.
  async getEarningComponents(): Promise<EarningComponent[]> {
    const compensation = await fetchCompensation()
    const total = (pick: (record: ApiCompensation) => number) => compensation.reduce((sum, record) => sum + pick(record), 0)
    const totals: Record<EarningComponent['id'], number> = {
      basic: total((record) => record.basicSalary),
      housing: total((record) => record.housingAllowance),
      transport: total((record) => record.transportAllowance),
      other: total((record) => record.otherAllowances),
    }
    const gross = totals.basic + totals.housing + totals.transport + totals.other
    return EARNING_COMPONENTS.map((component) => ({
      ...component,
      percentOfGross: gross ? Math.round((totals[component.id] / gross) * 100) : 0,
    }))
  },

  // History is per employee; amounts are kobo per year.
  async getSalaryChanges(): Promise<SalaryChangeEntry[]> {
    const compensation = await fetchCompensation()
    const histories = await Promise.all(
      compensation.map(async (employee) => {
        const { data } = await http.get<ApiCompensationChange[]>(
          `/people/employees/${employee.employeeId}/compensation-history`,
        )
        return data
          .filter((change) => change.previousSalary > 0)
          .map((change) => ({
            id: change.id,
            employeeId: employee.employeeId,
            employeeName: employee.fullName,
            avatarInitials: initials(employee.fullName),
            previousSalary: change.previousSalary / 100,
            newSalary: change.newSalary / 100,
            currency: change.currency ?? employee.currency,
            effectiveDate: change.effectiveDate,
            reason: change.reason ?? '',
          }))
      }),
    )
    return histories.flat().sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))
  },

  // Lifecycle: create → calculate → submit (approval happens via /approvals)
  // → funding check → execute → reconcile.
  async createRun(input: { periodMonth: number; periodYear: number; title: string }): Promise<string> {
    const { data } = await http.post<{ payrollRun: { id: string } }>('/payroll/runs', input)
    return data.payrollRun.id
  },

  async calculateRun(id: string): Promise<void> {
    await http.post(`/payroll/runs/${id}/calculate`)
  },

  async submitRun(id: string): Promise<void> {
    await http.post(`/payroll/runs/${id}/submit`)
  },

  // confirmed: false records a shortfall.
  async attestFunding(id: string, input: { confirmed: boolean; notes?: string }): Promise<void> {
    await http.post(`/payroll/runs/${id}/funding-check`, input)
  },

  // Reusing the key on a retry replays the original response instead of paying twice.
  async executeRun(id: string, idempotencyKey: string): Promise<void> {
    await http.post(`/payroll/runs/${id}/execute`, {}, { headers: { 'Idempotency-Key': idempotencyKey } })
  },

  async reconcileRun(id: string): Promise<void> {
    await http.post(`/payroll/runs/${id}/reconcile`)
  },

  // Generated payslips come from GET /payroll/payslips. A run awaiting approval
  // lists its employees as pending, since approval is what generates payslips.
  async getPayslips(): Promise<PayslipRecord[]> {
    const [{ data }, runs] = await Promise.all([
      http.get<{ payslips: ApiPayslip[] }>('/payroll/payslips'),
      fetchRuns(),
    ])
    const runById = new Map(runs.map((run) => [run.id, run]))
    const toRecord = (
      run: ApiPayrollRun,
      record: { id: string; employeeId: string; name: string; netPay: number },
      status: PayslipRecord['status'],
    ): PayslipRecord => ({
      id: record.id,
      runId: run.id,
      employeeId: record.employeeId,
      employeeName: record.name,
      avatarInitials: initials(record.name),
      periodLabel: toRunMeta(run).periodLabel,
      payDate: run.payDate,
      netPay: record.netPay,
      currency: run.currency,
      status,
    })

    const generated = data.payslips.flatMap((payslip) => {
      const run = runById.get(payslip.payrollRunId)
      if (!run) return []
      const name = payslip.employee?.fullName ?? 'Unknown employee'
      return [toRecord(run, { id: payslip.id, employeeId: payslip.employeeId, name, netPay: payslip.netSalary }, 'generated')]
    })

    const awaitingApproval = runs.filter((run) => toApiEnum(run.status) === 'PENDING_APPROVAL')
    const pending = (await Promise.all(awaitingApproval.map((run) => fetchRun(run.id)))).flatMap((run) =>
      run.items.map((item) =>
        toRecord(
          run,
          {
            id: `${run.id}-${item.employeeId}`,
            employeeId: item.employeeId,
            name: item.employee?.fullName ?? 'Unknown employee',
            netPay: item.netSalary,
          },
          'pending',
        ),
      ),
    )

    return [...generated, ...pending].sort((a, b) => b.payDate.localeCompare(a.payDate))
  },
}
