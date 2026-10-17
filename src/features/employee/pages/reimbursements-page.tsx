import { ReceiptIcon } from '@phosphor-icons/react'
import { ComingSoon } from '../../../components/ui/coming-soon'

export function MyReimbursementsPage() {
  return (
    <div className="max-w-[900px] space-y-5">
      <h1 className="text-xl font-medium text-ink">My Reimbursements</h1>
      <ComingSoon
        icon={ReceiptIcon}
        title="Reimbursement tracking"
        description="Soon you'll be able to track each reimbursement through to payment. For now, a claim's status is shown under My Expenses."
      />
    </div>
  )
}
