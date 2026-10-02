export interface MyLeaveBalance {
  allocatedDays: number
  usedDays: number
  pendingDays?: number
  remainingDays: number
  leaveType?: { id: string; name: string }
}

export interface MyLeaveRequest {
  id: string
  startDate: string
  endDate: string
  totalDays: number
  status: string
  leaveType?: { id: string; name: string }
}

export interface UpcomingLeave {
  startDate: string
  endDate: string
  typeName?: string
}

export interface LeaveSummary {
  hasBalances: boolean
  availableDays: number
  usedDays: number
  pendingRequests: number
  upcoming?: UpcomingLeave
}
