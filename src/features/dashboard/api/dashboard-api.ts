import { toApiEnum } from '../../../lib/api-enum'
import { http } from '../../../lib/http'
import { approvalsApi } from '../../approvals/api/approvals-api'
import type { ApprovalRequest } from '../../approvals/types/approval-request-types'
import { useAuthStore } from '../../auth/store/auth-store'
import { organizationsApi } from '../../organizations/api/organizations-api'
import { peopleApi } from '../../people/api/people-api'
import type { EmployeeSummary, LeaveRequestWithEmployee } from '../../people/types/people-types'
import type {
  ActivityItem,
  ActivityKind,
  ApprovalCategory,
  ApprovalCategoryKey,
  ApprovalItem,
  DashboardSummary,
  PayrollStatusSummary,
  UpcomingPayrollRun,
} from '../types/dashboard-types'

interface ApprovalCategoryMeta {
  key: ApprovalCategoryKey
  label: string
  title: string
  viewAllPath: string
  activityKind: ActivityKind
}

const CATEGORIES: Record<string, ApprovalCategoryMeta> = {
  LEAVE: {
    key: 'leave',
    label: 'Leave requests',
    title: 'Leave request',
    viewAllPath: '/people/leave',
    activityKind: 'leave',
  },
  EXPENSE: {
    key: 'expenses',
    label: 'Expense claims',
    title: 'Expense claim',
    viewAllPath: '/spend/expenses',
    activityKind: 'expense',
  },
  REIMBURSEMENT: {
    key: 'reimbursements',
    label: 'Reimbursements',
    title: 'Reimbursement',
    viewAllPath: '/spend/reimbursements',
    activityKind: 'reimbursement',
  },
  SALARY_ADVANCE: {
    key: 'salary-advances',
    label: 'Salary advances',
    title: 'Salary advance',
    viewAllPath: '/payroll/salary-advances',
    activityKind: 'salary-advance',
  },
}

const CLOSED_PAYROLL_STATUSES = ['EXECUTED', 'RECONCILED']

interface ApiPayrollRun {
  id: string
  title: string | null
  periodMonth: number
  periodYear: number
  status: string
  totalGross: number
  totalNet: number
}

interface ApiPayrollRunDetail extends ApiPayrollRun {
  items: { id: string }[]
}

const isOpenRun = (run: ApiPayrollRun) => !CLOSED_PAYROLL_STATUSES.includes(run.status)

function pickCurrentRun(runs: ApiPayrollRun[]): ApiPayrollRun | undefined {
  const byLatestPeriod = [...runs].sort(
    (a, b) => b.periodYear - a.periodYear || b.periodMonth - a.periodMonth,
  )
  return byLatestPeriod.find(isOpenRun) ?? byLatestPeriod[0]
}

function periodLabel(run: ApiPayrollRun): string {
  return new Date(run.periodYear, run.periodMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function toUpcomingRuns(runs: ApiPayrollRun[]): UpcomingPayrollRun[] {
  return runs
    .filter(isOpenRun)
    .sort((a, b) => a.periodYear - b.periodYear || a.periodMonth - b.periodMonth)
    .slice(0, 3)
    .map((run) => ({
      id: run.id,
      title: run.title ?? periodLabel(run),
      periodLabel: periodLabel(run),
      status: run.status,
    }))
}

// Amounts come back in minor units (kobo).
async function getPayrollStatus(
  run: ApiPayrollRun,
  currency: string,
  employeesTotal: number,
): Promise<PayrollStatusSummary> {
  const { data } = await http.get<{ payrollRun: ApiPayrollRunDetail }>(`/payroll/runs/${run.id}`)

  return {
    id: run.id,
    title: run.title ?? periodLabel(run),
    periodLabel: periodLabel(run),
    status: run.status,
    totalGross: run.totalGross / 100,
    totalNet: run.totalNet / 100,
    currency,
    employeesIncluded: data.payrollRun.items.length,
    employeesTotal,
  }
}

function countOnLeaveToday(requests: LeaveRequestWithEmployee[]): number {
  const today = new Date().toLocaleDateString('en-CA')
  const onLeave = requests.filter(
    (request) =>
      toApiEnum(request.status) === 'APPROVED' &&
      request.startDate.slice(0, 10) <= today &&
      request.endDate.slice(0, 10) >= today,
  )
  return new Set(onLeave.map((request) => request.employeeId)).size
}

const OTHER: ApprovalCategoryMeta = {
  key: 'other',
  label: 'Other requests',
  title: 'Approval request',
  viewAllPath: '/approvals',
  activityKind: 'other',
}

function readReason(metadata: string | null): string | undefined {
  if (!metadata) return undefined
  try {
    const reason: unknown = JSON.parse(metadata)?.reason
    return typeof reason === 'string' ? reason : undefined
  } catch {
    return undefined
  }
}

function toApprovalItem(request: ApprovalRequest, title: string): ApprovalItem {
  const isLeave = request.type === 'LEAVE'
  const summary = request.subjectSummary
  const reason = summary?.reason ?? readReason(request.metadata)
  const days = summary?.totalDays ?? request.amountSnapshot
  const leaveDetail = [summary?.leaveType ?? title, reason, days ? `${days} day${days === 1 ? '' : 's'}` : undefined]
    .filter(Boolean)
    .join(' · ')

  return {
    id: request.id,
    requesterId: request.requesterId,
    title: request.requester?.fullName ?? title,
    detail: isLeave ? leaveDetail : (reason ?? title),
    submittedAt: request.submittedAt,
    amount: !isLeave && request.amountSnapshot ? request.amountSnapshot : undefined,
  }
}

function groupApprovals(requests: ApprovalRequest[]): ApprovalCategory[] {
  const categories = new Map<ApprovalCategoryKey, ApprovalCategory>()

  for (const request of requests) {
    const meta = CATEGORIES[request.type] ?? OTHER
    const category = categories.get(meta.key) ?? {
      key: meta.key,
      label: meta.label,
      viewAllPath: meta.viewAllPath,
      items: [],
    }
    category.items.push(toApprovalItem(request, meta.title))
    categories.set(meta.key, category)
  }

  return [...categories.values()]
}

const RECENT_ACTIVITY_LIMIT = 6

function toRecentActivity(requests: ApprovalRequest[], currentUserId?: string): ActivityItem[] {
  const nameOf = (person: { id: string; fullName: string } | null) =>
    person?.id === currentUserId ? 'You' : (person?.fullName ?? 'Someone')

  const events = requests.flatMap((request) => {
    const meta = CATEGORIES[request.type] ?? OTHER
    const leaveType = request.subjectSummary?.leaveType
    const subject = leaveType ?? meta.title.toLowerCase()
    const items: ActivityItem[] = [
      {
        id: `${request.id}-submitted`,
        kind: meta.activityKind,
        actor: nameOf(request.requester),
        description: leaveType ? `Requested ${leaveType}` : `Submitted ${/^[aeiou]/.test(subject) ? 'an' : 'a'} ${subject}`,
        timestamp: request.submittedAt,
      },
    ]

    if (request.decidedAt && (request.status === 'APPROVED' || request.status === 'REJECTED')) {
      const requester = request.requester?.id === currentUserId ? 'your' : `${nameOf(request.requester)}'s`
      items.push({
        id: `${request.id}-decided`,
        kind: meta.activityKind,
        actor: nameOf(request.approver),
        description: `${request.status === 'APPROVED' ? 'Approved' : 'Rejected'} ${requester} ${subject}`,
        timestamp: request.decidedAt,
      })
    }
    return items
  })

  return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, RECENT_ACTIVITY_LIMIT)
}

export const dashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    const [employees, approvals, recentApprovals, leaveRequests, payroll, organizations] = await Promise.all([
      http.get<EmployeeSummary[]>('/people/employees'),
      approvalsApi.listPending(),
      approvalsApi.listRecent(),
      peopleApi.getLeaveRequests(),
      http.get<{ payrollRuns: ApiPayrollRun[] }>('/payroll/runs'),
      organizationsApi.getOrganizations(),
    ])

    const currentUser = useAuthStore.getState().user
    const orgId = currentUser?.organizationId
    const currency = organizations.find((organization) => organization.id === orgId)?.currency ?? 'NGN'
    const currentRun = pickCurrentRun(payroll.data.payrollRuns)

    const countByStatus = (status: EmployeeSummary['employmentStatus']) =>
      employees.data.filter((employee) => employee.employmentStatus === status).length

    return {
      overview: {
        activeEmployees: countByStatus('active'),
        pendingInvitations: countByStatus('pending_invitation'),
        pendingApprovalsCount: approvals.total,
        onLeaveToday: countOnLeaveToday(leaveRequests),
        openPayrollRuns: payroll.data.payrollRuns.filter(isOpenRun).length,
      },
      approvalCategories: groupApprovals(approvals.items),
      currentPayroll: currentRun ? await getPayrollStatus(currentRun, currency, employees.data.length) : null,
      upcomingPayroll: toUpcomingRuns(payroll.data.payrollRuns),
      recentActivity: toRecentActivity(recentApprovals, currentUser?.id),
    }
  },
}
