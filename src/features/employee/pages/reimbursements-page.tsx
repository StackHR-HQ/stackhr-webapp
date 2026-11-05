import { ReceiptIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { Modal } from '../../../components/ui/modal'
import { getApiErrorMessage } from '../../../lib/http'
import { notify } from '../../../lib/toast'
import { formatAmount, formatDate } from '../../dashboard/lib/format'
import { ReimbursementClaimForm } from '../components/reimbursement-claim-form'
import { useMyProfile } from '../hooks/use-my-profile'
import { useCancelReimbursement, useMyReimbursements } from '../hooks/use-my-spend'
import { requestStatusMeta } from '../lib/request-status'
import type { MyReimbursement } from '../types/employee-types'

const claimTitle = (reimbursement: MyReimbursement) =>
  reimbursement.description || (reimbursement.expenseId ? 'Approved expense claim' : 'Reimbursement claim')

export function MyReimbursementsPage() {
  const [submitting, setSubmitting] = useState(false)
  const [cancelling, setCancelling] = useState<MyReimbursement | null>(null)
  const profile = useMyProfile()
  const reimbursements = useMyReimbursements(profile.data?.id)
  const cancelReimbursement = useCancelReimbursement()
  const currency = profile.data?.currency ?? 'NGN'

  const confirmCancel = async () => {
    if (!cancelling) return
    try {
      await cancelReimbursement.mutateAsync(cancelling.id)
      notify.success('Reimbursement claim cancelled')
      setCancelling(null)
    } catch (err) {
      notify.error("Couldn't cancel the claim", getApiErrorMessage(err))
    }
  }

  const sorted = reimbursements.data
    ? reimbursements.data.toSorted((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    : []
  // The claims query waits for the profile's id, so a failed profile must be
  // checked first or the skeleton would never go away.
  const loadFailed = profile.isError || reimbursements.isError
  const isPending = !loadFailed && (profile.isPending || reimbursements.isPending)
  const retry = () => {
    if (profile.isError) void profile.refetch()
    else void reimbursements.refetch()
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-ink">My Reimbursements</h1>
          <p className="mt-1 text-sm text-muted">Get paid back for money you&apos;ve spent on work.</p>
        </div>
        <div className="shrink-0">
          <Button type="button" onClick={() => setSubmitting(true)} className="w-auto px-4">
            New claim
          </Button>
        </div>
      </div>

      <Modal open={submitting} onClose={() => setSubmitting(false)} title="New reimbursement claim">
        {submitting ? (
          <ReimbursementClaimForm
            currency={currency}
            onDone={() => {
              notify.success('Reimbursement claim submitted')
              setSubmitting(false)
            }}
            onCancel={() => setSubmitting(false)}
          />
        ) : null}
      </Modal>

      <Modal open={cancelling !== null} onClose={() => setCancelling(null)} title="Cancel reimbursement claim">
        {cancelling ? (
          <div className="space-y-5">
            <p className="text-sm text-muted">
              Cancel your claim for {formatAmount(cancelling.amount, cancelling.currency ?? currency)}? You can submit a
              new claim later.
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" width="fit" className="px-6" onClick={() => setCancelling(null)}>
                Keep claim
              </Button>
              <Button
                type="button"
                width="fit"
                className="px-6"
                loading={cancelReimbursement.isPending}
                onClick={confirmCancel}
              >
                Cancel claim
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {isPending ? (
        <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
      ) : loadFailed ? (
        <Card>
          <div className="py-4 text-center">
            <p className="text-sm text-muted">Couldn&apos;t load your reimbursements right now.</p>
            <button
              type="button"
              onClick={retry}
              className="mt-2 text-sm font-medium text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        </Card>
      ) : sorted.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <ReceiptIcon size={28} weight="duotone" className="text-muted" />
            <p className="text-sm text-muted">You haven&apos;t claimed any reimbursements yet.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {sorted.map((reimbursement) => {
              const status = requestStatusMeta(reimbursement.status)
              const paidOn = reimbursement.paidAt ? `Paid ${formatDate(reimbursement.paidAt)}` : null
              return (
                <li key={reimbursement.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{claimTitle(reimbursement)}</p>
                    <p className="truncate text-xs text-muted">
                      {[reimbursement.createdAt ? formatDate(reimbursement.createdAt) : null, paidOn]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {/* Only a claim nobody has decided on yet can be cancelled. */}
                    {reimbursement.status === 'pending' && !reimbursement.expenseId ? (
                      <button
                        type="button"
                        onClick={() => setCancelling(reimbursement)}
                        className="text-xs font-medium text-muted hover:text-critical"
                      >
                        Cancel
                      </button>
                    ) : null}
                    <span className="text-sm text-ink">
                      {formatAmount(reimbursement.amount, reimbursement.currency ?? currency)}
                    </span>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
