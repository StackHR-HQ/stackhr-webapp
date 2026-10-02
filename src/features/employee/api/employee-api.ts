import { http } from '../../../lib/http'
import type { MyLeaveBalance, MyLeaveRequest } from '../types/employee-types'

export const employeeApi = {
  async getLeaveBalances(): Promise<MyLeaveBalance[]> {
    const { data } = await http.get<{ leaveBalances: MyLeaveBalance[] }>('/me/leave-balances')
    return data.leaveBalances
  },

  async getLeaveRequests(): Promise<MyLeaveRequest[]> {
    const { data } = await http.get<{ leaveRequests: MyLeaveRequest[] }>('/me/leave-requests')
    return data.leaveRequests
  },
}
