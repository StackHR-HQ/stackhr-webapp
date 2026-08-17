import { EMPLOYEES } from '../../people/data/employees'
import { getRunMeta, PAYROLL_RUNS } from '../../payroll/data/payroll-runs'
import { getEmployeesAsOf } from '../../payroll/lib/employees-as-of'
import { calculateRunLines, summarizeRun } from '../../payroll/lib/payroll-calculation'
import { getStatutoryContributions } from '../../payroll/lib/statutory-contributions'
import type { DashboardSummary } from '../types/dashboard-types'

const CURRENT_RUN_ID = 'run-2026-08'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function daysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function buildDashboardSummary(): DashboardSummary {
  const activeEmployees = EMPLOYEES.filter((employee) => employee.employmentStatus === 'active').length

  const currentRunMeta = getRunMeta(CURRENT_RUN_ID)!
  const currentRunEmployees = getEmployeesAsOf(currentRunMeta.payDate)
  const currentRunContributions = getStatutoryContributions(currentRunEmployees.length)
  const currentRunLines = calculateRunLines(currentRunEmployees, currentRunMeta.taxRuleSetId, currentRunContributions)
  const currentRunSummary = summarizeRun(currentRunLines, 'NGN')

  const upcomingRunIds = ['run-2026-08', 'run-2026-08-bonus', 'run-2026-09']

  return {
    overview: {
      activeEmployees,
      pendingApprovalsCount: 10,
      openComplianceAlertsCount: 2,
      nextPayDate: currentRunMeta.payDate,
    },
    payroll: {
      periodLabel: currentRunMeta.periodLabel,
      status: currentRunMeta.status,
      payDate: currentRunMeta.payDate,
      totalNet: currentRunSummary.netPay,
      currency: currentRunSummary.currency,
      employeesIncluded: currentRunSummary.employeeCount,
      employeesTotal: EMPLOYEES.length,
    },
    upcomingPayroll: upcomingRunIds.map((id) => {
      const run = PAYROLL_RUNS.find((candidate) => candidate.id === id)!
      return { id: run.id, periodLabel: run.periodLabel, payDate: run.payDate, status: run.status }
    }),
    approvalCategories: [
      {
        key: 'employee-changes',
        label: 'Employee changes',
        viewAllPath: '/people/employees',
        items: [
          {
            id: 'ec-1',
            employeeName: 'Ada Obi',
            detail: 'Job title change: Software Engineer → Senior Software Engineer',
            submittedAt: daysFromNow(-1),
          },
          {
            id: 'ec-2',
            employeeName: 'Femi Bello',
            detail: 'Bank account update for salary payment',
            submittedAt: daysFromNow(-2),
          },
        ],
      },
      {
        key: 'leave',
        label: 'Leave requests',
        viewAllPath: '/people/leave',
        items: [
          {
            id: 'lv-1',
            employeeName: 'Chuka Eze',
            detail: 'Annual leave · Aug 24 – Aug 28 (5 days)',
            submittedAt: daysFromNow(-1),
          },
          {
            id: 'lv-2',
            employeeName: 'Ngozi Umeh',
            detail: 'Sick leave · Aug 18 – Aug 19 (2 days)',
            submittedAt: daysFromNow(0),
          },
          {
            id: 'lv-3',
            employeeName: 'Tunde Salako',
            detail: 'Annual leave · Sep 1 – Sep 5 (5 days)',
            submittedAt: daysFromNow(-3),
          },
        ],
      },
      {
        key: 'expenses',
        label: 'Expense claims',
        viewAllPath: '/spend/expenses',
        items: [
          {
            id: 'ex-1',
            employeeName: 'Ibrahim Musa',
            detail: 'Client dinner — Lagos office',
            submittedAt: daysFromNow(-1),
            amount: 42_500,
            currency: 'NGN',
          },
          {
            id: 'ex-2',
            employeeName: 'Bisi Adeyemi',
            detail: 'Ride-hailing — client site visits',
            submittedAt: daysFromNow(-2),
            amount: 18_000,
            currency: 'NGN',
          },
        ],
      },
      {
        key: 'reimbursements',
        label: 'Reimbursements',
        viewAllPath: '/spend/reimbursements',
        items: [
          {
            id: 'rb-1',
            employeeName: 'Grace Nwosu',
            detail: 'Conference travel — Abuja HR Summit',
            submittedAt: daysFromNow(-4),
            amount: 96_000,
            currency: 'NGN',
          },
        ],
      },
      {
        key: 'salary-advances',
        label: 'Salary advances',
        viewAllPath: '/payroll/salary-advances',
        items: [
          {
            id: 'sa-1',
            employeeName: 'Kelechi Nnamdi',
            detail: 'Advance request — 1 month salary',
            submittedAt: daysFromNow(-1),
            amount: 350_000,
            currency: 'NGN',
          },
          {
            id: 'sa-2',
            employeeName: 'Halima Yusuf',
            detail: 'Advance request — medical emergency',
            submittedAt: daysFromNow(0),
            amount: 150_000,
            currency: 'NGN',
          },
        ],
      },
    ],
    recentActivity: [
      {
        id: 'act-1',
        kind: 'payroll',
        actor: 'System',
        description: 'August 2026 payroll run moved to Processing',
        timestamp: daysFromNow(-0.2),
      },
      {
        id: 'act-2',
        kind: 'leave',
        actor: 'Ngozi Umeh',
        description: 'Submitted a sick leave request',
        timestamp: daysFromNow(-0.4),
      },
      {
        id: 'act-3',
        kind: 'expense',
        actor: 'You',
        description: 'Approved an expense claim from Chuka Eze',
        timestamp: daysFromNow(-1),
      },
      {
        id: 'act-4',
        kind: 'employee',
        actor: 'Ada Obi',
        description: 'Requested a job title change',
        timestamp: daysFromNow(-1.3),
      },
      {
        id: 'act-5',
        kind: 'compliance',
        actor: 'System',
        description: 'PAYE remittance for July 2026 filed successfully',
        timestamp: daysFromNow(-2),
      },
      {
        id: 'act-6',
        kind: 'salary-advance',
        actor: 'Kelechi Nnamdi',
        description: 'Requested a salary advance',
        timestamp: daysFromNow(-2.5),
      },
    ],
    complianceAlerts: [
      {
        id: 'ca-1',
        title: 'Pension remittance due soon',
        description: 'July 2026 pension contributions must be remitted before the deadline.',
        severity: 'warning',
        dueDate: daysFromNow(5),
      },
      {
        id: 'ca-2',
        title: 'Missing tax ID for 1 employee',
        description: 'Halima Yusuf is missing a TIN on file, required for August payroll filing.',
        severity: 'critical',
      },
    ],
    subscription: {
      planName: 'Growth (Trial)',
      status: 'trial',
      trialEndsAt: daysFromNow(6),
      seatsUsed: EMPLOYEES.length,
      seatsLimit: 25,
    },
  }
}

export const mockDashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    await delay(500)
    return buildDashboardSummary()
  },
}
