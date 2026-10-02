import { http } from '../../../lib/http'
import type { LeaveRequestPayload, LeaveTypeOption, MyLeaveBalance, MyLeaveRequest } from '../types/employee-types'

export const employeeApi = {
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
