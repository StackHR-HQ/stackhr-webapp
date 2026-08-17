import { useState } from 'react'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { LeaveBalancesView } from '../components/leave/leave-balances-view'
import { LeaveCalendarView } from '../components/leave/leave-calendar-view'
import { LeavePoliciesView } from '../components/leave/leave-policies-view'
import { LeaveRequestsView } from '../components/leave/leave-requests-view'
import { LeaveTypesView } from '../components/leave/leave-types-view'
import { useLeaveBalances } from '../hooks/use-leave-balances'
import { useLeavePolicies } from '../hooks/use-leave-policies'
import { useLeaveRequests } from '../hooks/use-leave-requests'
import { useLeaveTypes } from '../hooks/use-leave-types'

type LeaveTabKey = 'requests' | 'calendar' | 'types' | 'policies' | 'balances'

const LEAVE_TABS: { key: LeaveTabKey; label: string }[] = [
  { key: 'requests', label: 'Leave Requests' },
  { key: 'calendar', label: 'Leave Calendar' },
  { key: 'types', label: 'Leave Types' },
  { key: 'policies', label: 'Leave Policies' },
  { key: 'balances', label: 'Leave Balances' },
]

export function LeavePage() {
  const [activeTab, setActiveTab] = useState<LeaveTabKey>('requests')
  const { data: requests, isPending: requestsPending } = useLeaveRequests()
  const { data: leaveTypes, isPending: typesPending } = useLeaveTypes()
  const { data: policies, isPending: policiesPending } = useLeavePolicies()
  const { data: balances, isPending: balancesPending } = useLeaveBalances()

  const pendingByTab: Record<LeaveTabKey, boolean> = {
    requests: requestsPending,
    calendar: requestsPending,
    types: typesPending,
    policies: policiesPending,
    balances: balancesPending,
  }
  const isPending = pendingByTab[activeTab]

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Leave</h1>
        <p className="mt-1 text-sm text-muted">Track requests, time off, and leave policy across your team.</p>
      </div>

      <UnderlineTabs tabs={LEAVE_TABS} active={activeTab} onChange={setActiveTab} />

      {isPending ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'requests' ? <LeaveRequestsView requests={requests ?? []} /> : null}
          {activeTab === 'calendar' ? <LeaveCalendarView requests={requests ?? []} /> : null}
          {activeTab === 'types' ? <LeaveTypesView leaveTypes={leaveTypes ?? []} /> : null}
          {activeTab === 'policies' ? <LeavePoliciesView policies={policies ?? []} /> : null}
          {activeTab === 'balances' ? <LeaveBalancesView rows={balances ?? []} /> : null}
        </>
      )}
    </div>
  )
}
