import { TrashIcon } from '@phosphor-icons/react'
import { Badge } from '../../../../components/ui/badge'
import { Card } from '../../../../components/ui/card'
import { getApiErrorMessage } from '../../../../lib/api-error'
import { notify } from '../../../../lib/toast'
import { useDeleteLeaveType } from '../../hooks/use-delete-leave-type'
import type { LeaveType } from '../../types/people-types'

function LeaveTypeCard({ leaveType }: { leaveType: LeaveType }) {
  const deleteLeaveType = useDeleteLeaveType()

  function removeLeaveType() {
    if (!window.confirm(`Delete ${leaveType.name}? Its unused balances will be removed too.`)) return
    deleteLeaveType.mutate(leaveType.id, {
      onSuccess: () => notify.success('Leave type deleted'),
      // A 409 means employees have already requested this type, so its history has to stay.
      onError: (error: Error) => notify.error('Could not delete leave type', getApiErrorMessage(error, 'Please try again.')),
    })
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-ink">{leaveType.name}</p>
        <div className="flex shrink-0 items-center gap-1">
          <Badge tone={leaveType.tone}>{leaveType.paid ? 'Paid' : 'Unpaid'}</Badge>
          <button type="button" onClick={removeLeaveType} disabled={deleteLeaveType.isPending} aria-label={`Delete ${leaveType.name}`} className="rounded-md p-1.5 text-muted hover:bg-critical/10 hover:text-critical disabled:opacity-50"><TrashIcon className="h-4 w-4" /></button>
        </div>
      </div>
      <p className="mt-2 text-xl font-medium text-ink">
        {leaveType.defaultDays}
        <span className="text-sm font-normal text-muted"> days / year</span>
      </p>
      <p className="mt-2 text-xs text-muted">{leaveType.description}</p>
    </Card>
  )
}

export function LeaveTypesView({ leaveTypes }: { leaveTypes: LeaveType[] }) {
  return (
    <>
      {leaveTypes.length === 0 ? (
        <Card>
          <p className="py-6 text-center text-sm text-muted">
            No leave types yet. Add one so employees can request time off.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leaveTypes.map((leaveType) => <LeaveTypeCard key={leaveType.id} leaveType={leaveType} />)}
        </div>
      )}
    </>
  )
}
