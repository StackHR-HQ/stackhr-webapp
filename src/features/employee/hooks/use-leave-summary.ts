import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'
import type { LeaveSummary, MyLeaveBalance, MyLeaveRequest } from '../types/employee-types'

function summarize(balances: MyLeaveBalance[], requests: MyLeaveRequest[]): LeaveSummary {
  const today = new Date().toLocaleDateString('en-CA')
  const upcoming = requests
    .filter((request) => request.status === 'APPROVED' && request.endDate.slice(0, 10) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0]

  return {
    hasBalances: balances.length > 0,
    availableDays: balances.reduce((total, balance) => total + balance.remainingDays, 0),
    usedDays: balances.reduce((total, balance) => total + balance.usedDays, 0),
    pendingRequests: requests.filter((request) => request.status === 'PENDING').length,
    upcoming: upcoming
      ? { startDate: upcoming.startDate, endDate: upcoming.endDate, typeName: upcoming.leaveType?.name }
      : undefined,
  }
}

export function useLeaveSummary() {
  return useQuery({
    queryKey: ['me', 'leave-summary'],
    queryFn: async () => {
      const [balances, requests] = await Promise.all([employeeApi.getLeaveBalances(), employeeApi.getLeaveRequests()])
      return summarize(balances, requests)
    },
  })
}
