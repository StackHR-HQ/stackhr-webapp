import { toApiEnum } from '../../../lib/api-enum'
import { http } from '../../../lib/http'
import { approvalsApi } from '../../approvals/api/approvals-api'
import type { ApprovalRequest } from '../../approvals/types/approval-request-types'
import { peopleApi } from '../../people/api/people-api'
import type { EmployeeSummary, LeaveRequestWithEmployee } from '../../people/types/people-types'
import type { ApprovalCategory, ApprovalCategoryKey, ApprovalItem, DashboardSummary } from '../types/dashboard-types'

const CATEGORIES: Record<string, { key: ApprovalCategoryKey; label: string; title: string; viewAllPath: string }> = {
  LEAVE: { key: 'leave', label: 'Leave requests', title: 'Leave request', viewAllPath: '/people/leave' },
  EXPENSE: { key: 'expenses', label: 'Expense claims', title: 'Expense claim', viewAllPath: '/spend/expenses' },
  REIMBURSEMENT: {
    key: 'reimbursements',
    label: 'Reimbursements',
    title: 'Reimbursement',
    viewAllPath: '/spend/reimbursements',
  },
  SALARY_ADVANCE: {
    key: 'salary-advances',
    label: 'Salary advances',
    title: 'Salary advance',
    viewAllPath: '/payroll/salary-advances',
  },
}

const CLOSED_PAYROLL_STATUSES = ['EXECUTED', 'RECONCILED']

interface ApiPayrollRun {
  id: string
  periodMonth: number
  periodYear: number
  status: string
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

const OTHER = { key: 'other' as const, label: 'Other requests', title: 'Approval request', viewAllPath: '/approvals' }

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
  const reason = readReason(request.metadata)
  const days = request.amountSnapshot

  return {
    id: request.id,
    requesterId: request.requesterId,
    title,
    detail: isLeave && days ? `${reason ?? title} · ${days} day${days === 1 ? '' : 's'}` : (reason ?? title),
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

export const dashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    const [employees, approvals, leaveRequests, payroll] = await Promise.all([
      http.get<EmployeeSummary[]>('/people/employees'),
      approvalsApi.listPending(),
      peopleApi.getLeaveRequests(),
      http.get<{ payrollRuns: ApiPayrollRun[] }>('/payroll/runs'),
    ])

    const countByStatus = (status: EmployeeSummary['employmentStatus']) =>
      employees.data.filter((employee) => employee.employmentStatus === status).length

    return {
      overview: {
        activeEmployees: countByStatus('active'),
        pendingInvitations: countByStatus('pending_invitation'),
        pendingApprovalsCount: approvals.total,
        onLeaveToday: countOnLeaveToday(leaveRequests),
        openPayrollRuns: payroll.data.payrollRuns.filter((run) => !CLOSED_PAYROLL_STATUSES.includes(run.status)).length,
      },
      approvalCategories: groupApprovals(approvals.items),
    }
  },
}
