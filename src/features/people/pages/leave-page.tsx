import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Modal } from '../../../components/ui/modal'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { AddLeaveTypeForm } from '../components/leave/add-leave-type-form'
import { LeaveBalancesView } from '../components/leave/leave-balances-view'
import { LeaveCalendarView } from '../components/leave/leave-calendar-view'
import { LeavePoliciesView } from '../components/leave/leave-policies-view'
import { LeaveRequestsView } from '../components/leave/leave-requests-view'
import { LeaveTypesView } from '../components/leave/leave-types-view'
import { PeopleLoadError } from '../components/people-load-error'
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
  const [addingType, setAddingType] = useState(false)
  const requestsQuery = useLeaveRequests()
  const typesQuery = useLeaveTypes()
  const policiesQuery = useLeavePolicies()
  const balancesQuery = useLeaveBalances()
  const { data: requests, isPending: requestsPending } = requestsQuery
  const { data: leaveTypes, isPending: typesPending } = typesQuery
  const { data: policies, isPending: policiesPending } = policiesQuery
  const { data: balances, isPending: balancesPending } = balancesQuery

  const pendingByTab: Record<LeaveTabKey, boolean> = {
    requests: requestsPending,
    calendar: requestsPending,
    types: typesPending,
    policies: policiesPending,
    balances: balancesPending,
  }
  const isPending = pendingByTab[activeTab]
  const hasError =
    (activeTab === 'requests' || activeTab === 'calendar' ? requestsQuery.isError : false) ||
    (activeTab === 'types' ? typesQuery.isError : false) ||
    (activeTab === 'policies' ? policiesQuery.isError : false) ||
    (activeTab === 'balances' ? balancesQuery.isError : false)

  function retryActiveTab() {
    if (activeTab === 'requests' || activeTab === 'calendar') void requestsQuery.refetch()
    if (activeTab === 'types') void typesQuery.refetch()
    if (activeTab === 'policies') void policiesQuery.refetch()
    if (activeTab === 'balances') void balancesQuery.refetch()
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-ink">Leave</h1>
          <p className="mt-1 text-sm text-muted">Track requests, time off, and leave policy across your team.</p>
        </div>
        {activeTab === 'types' ? (
          <div className="shrink-0">
            <Button type="button" onClick={() => setAddingType(true)} className="px-4">
              Add leave type
            </Button>
          </div>
        ) : null}
      </div>

      <Modal open={addingType} onClose={() => setAddingType(false)} title="Add leave type">
        <AddLeaveTypeForm onDone={() => setAddingType(false)} onCancel={() => setAddingType(false)} />
      </Modal>

      <UnderlineTabs tabs={LEAVE_TABS} active={activeTab} onChange={setActiveTab} />

      {hasError ? (
        <PeopleLoadError resource="leave data" onRetry={retryActiveTab} />
      ) : isPending ? (
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
