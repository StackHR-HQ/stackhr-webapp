import { http } from '../../../lib/http'
import type {
  LeaveRequestPayload,
  LeaveTypeOption,
  MyAuditEvent,
  MyCompensationHistory,
  MyLeaveBalance,
  MyLeaveRequest,
  MyPayslip,
  MyProfile,
  MySpendRequest,
  ProfileUpdate,
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

  async getExpenses(): Promise<MySpendRequest[]> {
    const { data } = await http.get<{ expenses: MySpendRequest[] }>('/me/expenses')
    return data.expenses
  },

  async getSalaryAdvances(): Promise<MySpendRequest[]> {
    const { data } = await http.get<{ salaryAdvances: MySpendRequest[] }>('/me/advances')
    return data.salaryAdvances
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

  async submitLeaveRequest(payload: LeaveRequestPayload): Promise<void> {
    await http.post('/leave/requests', { ...payload, reason: payload.reason || undefined })
  },
}
