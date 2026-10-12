import { toApiEnum } from '../../../lib/api-enum'
import { http } from '../../../lib/http'
import type { ApprovalRequest } from '../../approvals/types/approval-request-types'
import { humanizeEnum, initials } from '../../employee/lib/profile-format'
import { peopleApi } from '../../people/api/people-api'
import { EARNING_COMPONENTS } from '../lib/earning-structure'
import { summarizeRun } from '../lib/payroll-calculation'
import type {
  EarningComponent,
  EmployeeSalaryRow,
  PayrollOverview,
  PayrollRunDetail,
  PayrollRunListItem,
  PayrollRunMeta,
  PayrollRunStatus,
  PayslipRecord,
  RunEmployeeLine,
  SalaryBand,
  SalaryChangeEntry,
} from '../types/payroll-types'

// Shapes confirmed against staging. Amounts are whole currency units per
// month (gross × 12 matches the compensation's annualSalaryMinor / 100).
interface ApiPayrollRun {
  id: string
  periodMonth: number
  periodYear: number
  title: string
  status: string
  totalGross: number
  totalTax: number
  totalPension: number
  totalNet: number
  approvedAt: string | null
  executedAt: string | null
  reconciledAt: string | null
  payDate: string
  createdAt: string
  updatedAt: string
}

interface ApiPayrollRunItem {
  id: string
  employeeId: string
  employee: { id: string; fullName: string; email?: string; department?: string | null } | null
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

// Created for every item when a run is approved.
interface ApiPayslip {
  id: string
  employeeId: string
  grossSalary: number
  netSalary: number
  generatedAt: string
}

interface ApiPayrollRunDetail extends ApiPayrollRun {
  items: ApiPayrollRunItem[]
  payslips: ApiPayslip[]
}

// GET /payroll/compensation/:employeeId. Amounts are whole currency units per month.
interface ApiCompensationRecord {
  id: string
  employeeId: string
  effectiveFrom: string
  effectiveTo: string | null
  basicSalary: number
  housingAllowance: number
  transportAllowance: number
  otherAllowances: number
  currency: string
  paymentFrequency: string
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

const FAILURE_REASON: Record<string, string> = {
  REJECTED: 'This payroll run was rejected during approval.',
  FUNDING_SHORTFALL: 'The funding check found a shortfall. Top up the account and attest funding again.',
}

// Runs don't carry a currency; they're paid in the org's payroll currency.
const CURRENCY = 'NGN'

function toRunMeta(run: ApiPayrollRun): PayrollRunMeta {
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
    generatedAt: run.createdAt,
    approvedAt: run.approvedAt ?? undefined,
    failureReason: FAILURE_REASON[status],
  }
}

function toRunLine(item: ApiPayrollRunItem): RunEmployeeLine {
  const name = item.employee?.fullName ?? 'Unknown employee'
  const totalDeductions = item.taxDeduction + item.pensionDeduction + item.nhfDeduction + item.otherDeductions
  return {
    employeeId: item.employeeId,
    employeeName: name,
    avatarInitials: initials(name),
    // Run items have no job title, so the department stands in.
    jobTitle: item.employee?.department ?? '',
    basic: item.basicSalary,
    housing: item.housingAllowance,
    transport: item.transportAllowance,
    otherAllowances: item.otherAllowances,
    grossPay: item.grossSalary,
    paye: item.taxDeduction,
    pensionEmployee: item.pensionDeduction,
    nhfEmployee: item.nhfDeduction,
    totalDeductions,
    netPay: item.netSalary,
    pensionEmployer: item.employerPensionDeduction,
    // The engine doesn't calculate NHIA or NSITF yet.
    nhiaEmployer: 0,
    nsitfEmployer: 0,
    totalEmployerContributions: item.employerPensionDeduction,
    employerCost: item.grossSalary + item.employerPensionDeduction,
  }
}

function toRunDetail(run: ApiPayrollRunDetail): PayrollRunDetail {
  const lines = run.items.map(toRunLine)
  return {
    ...toRunMeta(run),
    summary: summarizeRun(lines, CURRENCY),
    // Not returned by the backend yet.
    statutoryContributions: [],
    complianceWarnings: [],
    auditLog: [],
    lines,
  }
}

async function fetchRun(id: string): Promise<ApiPayrollRunDetail> {
  const { data } = await http.get<{ payrollRun: ApiPayrollRunDetail }>(`/payroll/runs/${id}`)
  return data.payrollRun
}

// The list has no employee count or deduction totals, so each run's detail is fetched too.
async function fetchFullRuns(): Promise<ApiPayrollRunDetail[]> {
  const { data } = await http.get<{ payrollRuns: ApiPayrollRun[] }>('/payroll/runs')
  const runs = await Promise.all(data.payrollRuns.map((run) => fetchRun(run.id)))
  return runs.sort((a, b) => b.payDate.localeCompare(a.payDate))
}

async function fetchRunDetails(): Promise<PayrollRunDetail[]> {
  return (await fetchFullRuns()).map(toRunDetail)
}

const monthlyGross = (record: ApiCompensationRecord) =>
  record.basicSalary + record.housingAllowance + record.transportAllowance + record.otherAllowances

// There's no org-wide salary endpoint, so each employee's compensation is fetched.
async function fetchCompensation() {
  const employees = await peopleApi.getEmployees()
  return Promise.all(
    employees.map(async (employee) => {
      const { data } = await http.get<{ history: ApiCompensationRecord[] }>(`/payroll/compensation/${employee.id}`)
      const records = data.history.toSorted((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom))
      const current = records.find((record) => record.effectiveTo === null) ?? records.at(-1)
      return { employee, records, current }
    }),
  )
}

async function getEmployeeSalaryRows(): Promise<EmployeeSalaryRow[]> {
  const compensation = await fetchCompensation()
  return compensation.flatMap(({ employee, current }) => {
    if (!current) return []
    const monthlySalary = monthlyGross(current)
    return [
      {
        employeeId: employee.id,
        employeeName: employee.fullName,
        avatarInitials: employee.avatarInitials || initials(employee.fullName),
        jobTitle: employee.jobTitle,
        departmentId: employee.departmentId,
        annualSalary: monthlySalary * 12,
        monthlySalary,
        currency: current.currency,
        payFrequency: humanizeEnum(current.paymentFrequency),
      },
    ]
  })
}

const toListItem = (run: PayrollRunDetail): PayrollRunListItem => ({
  id: run.id,
  periodLabel: run.periodLabel,
  payPeriodStart: run.payPeriodStart,
  payPeriodEnd: run.payPeriodEnd,
  payDate: run.payDate,
  status: run.status,
  generatedAt: run.generatedAt,
  approvedAt: run.approvedAt,
  failureReason: run.failureReason,
  summary: run.summary,
})

export const payrollApi = {
  async getRuns(): Promise<PayrollRunListItem[]> {
    return (await fetchRunDetails()).map(toListItem)
  },

  async getRun(id: string): Promise<PayrollRunDetail | null> {
    const run = toRunDetail(await fetchRun(id))
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
    const runs = await fetchRunDetails()
    const currentRun = runs.find((run) => run.status !== 'completed') ?? runs[0] ?? null
    return {
      currentRun,
      previousRuns: runs.filter((run) => run.status === 'completed').slice(0, 6).map(toListItem),
      upcomingRuns: runs
        .filter((run) => run.status === 'draft' && run.id !== currentRun?.id)
        .reverse()
        .map(toListItem),
      complianceWarnings: currentRun?.complianceWarnings ?? [],
    }
  },

  getEmployeeSalaries: getEmployeeSalaryRows,

  async getSalaryBands(): Promise<SalaryBand[]> {
    const [rows, departments] = await Promise.all([getEmployeeSalaryRows(), peopleApi.getDepartments()])
    return departments.flatMap((department) => {
      const salaries = rows.filter((row) => row.departmentId === department.id).map((row) => row.annualSalary)
      if (salaries.length === 0) return []
      return [
        {
          departmentId: department.id,
          departmentName: department.name,
          employeeCount: salaries.length,
          minSalary: Math.min(...salaries),
          maxSalary: Math.max(...salaries),
          avgSalary: salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length,
        },
      ]
    })
  },

  // No configured structure exists, so each component's share comes from
  // employees' current compensation.
  async getEarningComponents(): Promise<EarningComponent[]> {
    const current = (await fetchCompensation()).flatMap((entry) => (entry.current ? [entry.current] : []))
    const totals: Record<EarningComponent['id'], number> = {
      basic: current.reduce((sum, record) => sum + record.basicSalary, 0),
      housing: current.reduce((sum, record) => sum + record.housingAllowance, 0),
      transport: current.reduce((sum, record) => sum + record.transportAllowance, 0),
      other: current.reduce((sum, record) => sum + record.otherAllowances, 0),
    }
    const gross = totals.basic + totals.housing + totals.transport + totals.other
    return EARNING_COMPONENTS.map((component) => ({
      ...component,
      percentOfGross: gross ? Math.round((totals[component.id] / gross) * 100) : 0,
    }))
  },

  // Each compensation record after an employee's first is a change. Records carry no reason.
  async getSalaryChanges(): Promise<SalaryChangeEntry[]> {
    const compensation = await fetchCompensation()
    return compensation
      .flatMap(({ employee, records }) =>
        records.slice(1).map((record, index) => ({
          id: record.id,
          employeeId: employee.id,
          employeeName: employee.fullName,
          avatarInitials: employee.avatarInitials || initials(employee.fullName),
          previousSalary: monthlyGross(records[index]) * 12,
          newSalary: monthlyGross(record) * 12,
          currency: record.currency,
          effectiveDate: record.effectiveFrom,
          reason: '',
        })),
      )
      .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))
  },

  // Generated payslips come from approved runs. A run awaiting approval lists
  // its employees as pending, since approval is what generates their payslips.
  async getPayslips(): Promise<PayslipRecord[]> {
    const runs = await fetchFullRuns()
    return runs.flatMap((run) => {
      const meta = toRunMeta(run)
      const nameById = new Map(run.items.map((item) => [item.employeeId, item.employee?.fullName]))
      const toRecord = (id: string, employeeId: string, netPay: number, status: PayslipRecord['status']) => {
        const name = nameById.get(employeeId) ?? 'Unknown employee'
        return {
          id,
          runId: run.id,
          employeeId,
          employeeName: name,
          avatarInitials: initials(name),
          periodLabel: meta.periodLabel,
          payDate: run.payDate,
          netPay,
          currency: CURRENCY,
          status,
        }
      }
      if (run.payslips.length > 0) {
        return run.payslips.map((payslip) => toRecord(payslip.id, payslip.employeeId, payslip.netSalary, 'generated'))
      }
      if (meta.status !== 'pending_approval') return []
      return run.items.map((item) => toRecord(`${run.id}-${item.employeeId}`, item.employeeId, item.netSalary, 'pending'))
    })
  },
}
