import { Money } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'
import { Modal } from '../../../components/ui/modal'
import { toApiEnum } from '../../../lib/api-enum'
import { getApiErrorMessage } from '../../../lib/http'
import { notify } from '../../../lib/toast'
import { formatAmount, formatDate } from '../../dashboard/lib/format'
import { SalaryAdvanceForm } from '../components/salary-advance-form'
import { useMyProfile } from '../hooks/use-my-profile'
import { useCancelSalaryAdvance, useMySalaryAdvances } from '../hooks/use-my-spend'
import { requestStatusMeta } from '../lib/request-status'
import type { MySalaryAdvance } from '../types/employee-types'

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

export function MySalaryAdvancePage() {
  const [requesting, setRequesting] = useState(false)
  const [cancelling, setCancelling] = useState<MySalaryAdvance | null>(null)
  const cancelAdvance = useCancelSalaryAdvance()
  const advances = useMySalaryAdvances()
  const profile = useMyProfile()
  const currency = profile.data?.currency ?? 'NGN'

  const confirmCancel = async () => {
    if (!cancelling) return
    try {
      await cancelAdvance.mutateAsync(cancelling.id)
      notify.success('Salary advance request cancelled')
      setCancelling(null)
    } catch (err) {
      notify.error("Couldn't cancel the request", getApiErrorMessage(err))
    }
  }

  const sorted = advances.data ? advances.data.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt)) : []
  const hasPending = sorted.some((advance) => ['PENDING', 'SUBMITTED'].includes(toApiEnum(advance.status)))

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-ink">My Salary Advance</h1>
          <p className="mt-1 text-sm text-muted">Get part of your salary early and repay it from future payslips.</p>
        </div>
        <div className="shrink-0">
          <Button
            type="button"
            onClick={() => setRequesting(true)}
            disabled={!advances.isSuccess || hasPending}
            className="w-auto px-4"
          >
            Request advance
          </Button>
        </div>
      </div>

      {hasPending ? (
        <p className="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted">
          You have a request awaiting approval. You can make another once it&apos;s been decided.
        </p>
      ) : null}

      <Modal open={requesting} onClose={() => setRequesting(false)} title="Request a salary advance">
        {requesting ? (
          <SalaryAdvanceForm
            currency={currency}
            onDone={() => {
              notify.success('Salary advance requested')
              setRequesting(false)
            }}
            onCancel={() => setRequesting(false)}
          />
        ) : null}
      </Modal>

      <Modal open={cancelling !== null} onClose={() => setCancelling(null)} title="Cancel salary advance request">
        {cancelling ? (
          <div className="space-y-5">
            <p className="text-sm text-muted">
              Cancel your request for {formatAmount(cancelling.amount, currency)}? You can make a new request later.
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" width="fit" className="px-6" onClick={() => setCancelling(null)}>
                Keep request
              </Button>
              <Button type="button" width="fit" className="px-6" loading={cancelAdvance.isPending} onClick={confirmCancel}>
                Cancel request
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {advances.isPending ? (
        <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
      ) : advances.isError ? (
        <Card>
          <div className="py-4 text-center">
            <p className="text-sm text-muted">Couldn&apos;t load your salary advances right now.</p>
            <button
              type="button"
              onClick={() => advances.refetch()}
              className="mt-2 text-sm font-medium text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        </Card>
      ) : sorted.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Money size={28} weight="duotone" className="text-muted" />
            <p className="text-sm text-muted">You haven&apos;t requested a salary advance yet.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {sorted.map((advance) => {
              const status = requestStatusMeta(advance.status)
              const repayment = [
                `Repay over ${plural(advance.repaymentMonths, 'month')}`,
                advance.monthlyDeduction ? `${formatAmount(advance.monthlyDeduction, currency)} / month` : null,
              ]
                .filter(Boolean)
                .join(' · ')
              return (
                <li key={advance.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{formatAmount(advance.amount, currency)}</p>
                    <p className="truncate text-xs text-muted">
                      {formatDate(advance.createdAt)} · {repayment}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {toApiEnum(advance.status) === 'PENDING' ? (
                      <button
                        type="button"
                        onClick={() => setCancelling(advance)}
                        className="text-xs font-medium text-muted hover:text-critical"
                      >
                        Cancel
                      </button>
                    ) : null}
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
