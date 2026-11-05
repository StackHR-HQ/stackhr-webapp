import { http } from '../../../lib/http'
import { fetchAllApprovals } from '../../approvals/api/approvals-api'
import { isReimbursementApproval, reimbursementStatus } from '../../spend/api/spend-api'
import type {
  ExpensePayload,
  LeaveRequestPayload,
  LeaveTypeOption,
  MyAuditEvent,
  MyCompensationHistory,
  MyDocument,
  MyExpense,
  MyLeaveBalance,
  MyLeaveRequest,
  MyPayslip,
  MyProfile,
  MyReimbursement,
  MySalaryAdvance,
  ProfileUpdate,
  ReimbursementPayload,
  SalaryAdvancePayload,
} from '../types/employee-types'

export const employeeApi = {
  async getProfile(): Promise<MyProfile> {
    const { data } = await http.get<{ profile: MyProfile }>('/me/profile')
    return data.profile
  },

  async updateProfile(update: ProfileUpdate): Promise<void> {
    await http.patch('/me/profile', update)
  },

  async getPayslips(): Promise<MyPayslip[]> {
    const { data } = await http.get<{ payslips: MyPayslip[] }>('/me/payslips')
    return data.payslips
  },

  async getExpenses(): Promise<MyExpense[]> {
    const { data } = await http.get<{ expenses: MyExpense[] }>('/me/expenses')
    return data.expenses
  },

  async submitExpense(payload: ExpensePayload): Promise<void> {
    await http.post('/spend/expenses', { ...payload, description: payload.description || undefined })
  },

  // Only pending claims can be cancelled.
  async cancelExpense(id: string): Promise<void> {
    await http.patch(`/spend/expenses/${id}/cancel`)
  },

  // There's no /me endpoint for reimbursements, and /reimbursements isn't
  // reliably limited to the caller, so rows are kept only when they carry this
  // employee's id. The backend leaves a claim PENDING after its approval is
  // decided, so the status comes from the approval, as on the admin side.
  async getReimbursements(employeeId: string): Promise<MyReimbursement[]> {
    const [{ data }, approvals] = await Promise.all([
      http.get<{ reimbursements: MyReimbursement[] }>('/reimbursements'),
      fetchAllApprovals({ type: 'EXPENSE' }),
    ])
    const approvalByClaim = new Map(
      approvals.filter(isReimbursementApproval).map((approval) => [approval.subjectId, approval]),
    )
    return data.reimbursements
      .filter((reimbursement) => reimbursement.employeeId === employeeId)
      .map((reimbursement) => ({
        ...reimbursement,
        status: reimbursementStatus(reimbursement, approvalByClaim.get(reimbursement.id)),
      }))
  },

  async submitReimbursement(payload: ReimbursementPayload): Promise<void> {
    await http.post('/reimbursements', payload)
  },

  // Only pending claims can be cancelled.
  async cancelReimbursement(id: string): Promise<void> {
    await http.patch(`/reimbursements/${id}/cancel`)
  },

  async getSalaryAdvances(): Promise<MySalaryAdvance[]> {
    const { data } = await http.get<{ salaryAdvances: MySalaryAdvance[] }>('/me/advances')
    return data.salaryAdvances
  },

  async submitSalaryAdvance(payload: SalaryAdvancePayload): Promise<void> {
    await http.post('/spend/advances', { ...payload, reason: payload.reason || undefined })
  },

  // Only pending requests can be cancelled.
  async cancelSalaryAdvance(id: string): Promise<void> {
    await http.patch(`/spend/advances/${id}/cancel`)
  },

  async getActivity(): Promise<MyAuditEvent[]> {
    const { data } = await http.get<{ activity: MyAuditEvent[] }>('/me/activity')
    return data.activity
  },

  async getNotifications(): Promise<MyAuditEvent[]> {
    const { data } = await http.get<{ notifications: MyAuditEvent[] }>('/me/notifications')
    return data.notifications
  },

  async getCompensationHistory(): Promise<MyCompensationHistory> {
    const { data } = await http.get<MyCompensationHistory>('/me/compensation-history')
    return { records: data.records ?? [], history: data.history ?? [] }
  },

  async getLeaveBalances(): Promise<MyLeaveBalance[]> {
    const { data } = await http.get<{ leaveBalances: MyLeaveBalance[] }>('/me/leave-balances')
    return data.leaveBalances
  },

  async getLeaveRequests(): Promise<MyLeaveRequest[]> {
    const { data } = await http.get<{ leaveRequests: MyLeaveRequest[] }>('/me/leave-requests')
    return data.leaveRequests
  },

  async getLeaveTypes(): Promise<LeaveTypeOption[]> {
    const { data } = await http.get<{ leaveTypes: LeaveTypeOption[] }>('/leave/types')
    return data.leaveTypes
  },

  async getDocuments(): Promise<MyDocument[]> {
    const { data } = await http.get<{ documents: MyDocument[] }>('/me/documents')
    return data.documents
  },

  async cancelLeaveRequest(id: string): Promise<void> {
    await http.patch(`/leave/requests/${id}/cancel`)
  },

  async submitLeaveRequest(payload: LeaveRequestPayload): Promise<void> {
    await http.post('/leave/requests', { ...payload, reason: payload.reason || undefined })
  },
}
