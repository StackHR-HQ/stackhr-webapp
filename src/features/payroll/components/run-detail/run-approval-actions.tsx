import { Button } from '../../../../components/ui/button'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { useDecideApproval } from '../../../approvals/hooks/use-decide-approval'
import type { ApprovalDecision } from '../../../approvals/types/approval-request-types'
import { useAuthStore } from '../../../auth/store/auth-store'

// Approving generates the run's payslips. The backend won't let the person
// who submitted the run decide on it.
export function RunApprovalActions({ approvalId, requesterId }: { approvalId: string; requesterId?: string }) {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const decideApproval = useDecideApproval()

  if (requesterId && requesterId === currentUserId) {
    return <p className="text-xs text-muted">You submitted this run. Another admin or manager needs to approve it.</p>
  }

  async function decide(status: ApprovalDecision) {
    try {
      await decideApproval.mutateAsync({ id: approvalId, status })
      notify.success(status === 'APPROVED' ? 'Payroll run approved' : 'Payroll run rejected')
    } catch (err) {
      notify.error("Couldn't record the decision", getApiErrorMessage(err))
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="secondary"
        width="fit"
        className="px-4"
        disabled={decideApproval.isPending}
        onClick={() => decide('REJECTED')}
      >
        Reject
      </Button>
      <Button
        type="button"
        width="fit"
        className="px-4"
        loading={decideApproval.isPending}
        onClick={() => decide('APPROVED')}
      >
        Approve
      </Button>
    </div>
  )
}
