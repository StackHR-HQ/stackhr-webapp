import { useQuery } from '@tanstack/react-query'
import { toApiEnum } from '../../../lib/api-enum'
import { employeeApi } from '../api/employee-api'
import type {
  ActivityTone,
  MyActivityItem,
  MyAuditEvent,
  MyLeaveRequest,
  MyPayslip,
  MySpendRequest,
} from '../types/employee-types'
import { payslipPeriod } from './use-my-payslips'

const ACTIVITY_LIMIT = 5

function statusTone(status: string): ActivityTone {
  if (['APPROVED', 'PAID', 'REIMBURSED', 'DISBURSED'].includes(status)) return 'positive'
  if (['REJECTED', 'CANCELLED'].includes(status)) return 'critical'
  return 'muted'
}

function leaveEvents(request: MyLeaveRequest): MyActivityItem[] {
  const type = request.leaveType?.name ?? 'Leave'
  const status = toApiEnum(request.status)
  const events: MyActivityItem[] = [
    { id: `${request.id}-submitted`, kind: 'leave', label: `${type} request submitted`, timestamp: request.createdAt, tone: 'muted' },
  ]
  if (status === 'APPROVED' || status === 'REJECTED') {
    events.push({
      id: `${request.id}-decided`,
      kind: 'leave',
      label: `${type} ${status === 'APPROVED' ? 'approved' : 'rejected'}`,
      timestamp: request.decidedAt ?? request.updatedAt,
      tone: statusTone(status),
    })
  }
  return events
}

function spendEvents(request: MySpendRequest, kind: 'expense' | 'salary-advance', noun: string): MyActivityItem[] {
  const status = toApiEnum(request.status)
  const events: MyActivityItem[] = [
    { id: `${request.id}-submitted`, kind, label: `${noun} submitted`, timestamp: request.createdAt, tone: 'muted' },
  ]
  if (request.updatedAt && status !== 'PENDING' && status !== 'SUBMITTED') {
    events.push({
      id: `${request.id}-${status}`,
      kind,
      label: `${noun} ${status.toLowerCase().replace(/_/g, ' ')}`,
      timestamp: request.updatedAt,
      tone: statusTone(status),
    })
  }
  return events
}

function payslipEvent(payslip: MyPayslip): MyActivityItem {
  return {
    id: `${payslip.id}-payslip`,
    kind: 'payslip',
    label: `Payslip for ${payslipPeriod(payslip)} available`,
    timestamp: payslip.createdAt ?? new Date(payslip.periodYear, payslip.periodMonth, 0).toISOString(),
    tone: 'accent',
  }
}

// Leave, payslip and spend events are built from their own endpoints, which carry
// richer detail, so /me/activity only contributes the events nothing else covers.
function profileEvents(events: MyAuditEvent[]): MyActivityItem[] {
  return events
    .filter((event) => event.action === 'PROFILE_UPDATED')
    .map((event) => ({ id: event.id, kind: 'profile', label: 'Profile updated', timestamp: event.createdAt, tone: 'accent' }))
}

export function useMyActivity() {
  return useQuery({
    queryKey: ['me', 'activity'],
    queryFn: async () => {
      const [leaveRequests, payslips, expenses, advances, auditEvents] = await Promise.all([
        employeeApi.getLeaveRequests(),
        employeeApi.getPayslips(),
        employeeApi.getExpenses(),
        employeeApi.getSalaryAdvances(),
        // Profile updates are a nice-to-have; don't fail the whole feed over them.
        employeeApi.getActivity().catch(() => []),
      ])

      return [
        ...leaveRequests.flatMap(leaveEvents),
        ...payslips.map(payslipEvent),
        ...expenses.flatMap((expense) => spendEvents(expense, 'expense', 'Expense claim')),
        ...advances.flatMap((advance) => spendEvents(advance, 'salary-advance', 'Salary advance')),
        ...profileEvents(auditEvents),
      ]
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, ACTIVITY_LIMIT)
    },
  })
}
