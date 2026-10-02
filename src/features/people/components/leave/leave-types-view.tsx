import { Badge } from '../../../../components/ui/badge'
import { Card } from '../../../../components/ui/card'
import type { LeaveType } from '../../types/people-types'

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
          {leaveTypes.map((leaveType) => (
            <Card key={leaveType.id}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-ink">{leaveType.name}</p>
                <Badge tone={leaveType.tone}>{leaveType.paid ? 'Paid' : 'Unpaid'}</Badge>
              </div>
              <p className="mt-2 text-xl font-medium text-ink">
                {leaveType.defaultDays}
                <span className="text-sm font-normal text-muted"> days / year</span>
              </p>
              <p className="mt-2 text-xs text-muted">{leaveType.description}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
