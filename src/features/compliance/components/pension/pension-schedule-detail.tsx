import { useState } from 'react'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { FormErrorBanner } from '../../../../components/ui/form-error-banner'
import { notify } from '../../../../lib/toast'
import type { PensionSchedule } from '../../api/pension-api'
import {
  useCheckValidation,
  useInitiatePensionPayment,
  useScheduleDisbursements,
  useSubmitSchedule,
  useSyncPensionPayment,
  useValidateSchedule,
} from '../../hooks/use-pension'
import { formatAmount } from '../../lib/format'
import { scheduleStatusMeta, pensionErrorMessage } from '../../lib/pension-status'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  )
}

const naira = (amount: number | null) => (amount == null ? '—' : formatAmount(amount, 'NGN'))

// One schedule's lifecycle: validate with PenCom → submit (final) → get the
// account to pay into → confirm payment → follow settlement with each PFA.
export function PensionScheduleDetail({ schedule }: { schedule: PensionSchedule }) {
  const status = scheduleStatusMeta(schedule.status)
  const [error, setError] = useState<string>()
  // From "Check validation" this session; otherwise what the schedule kept from
  // its last failed validation, so reopening it still shows what to fix.
  const [checkedErrors, setCheckedErrors] = useState<string[] | null>(null)
  const validationErrors =
    checkedErrors ?? (schedule.status === 'VALIDATION_FAILED' ? schedule.validationErrors : [])
  const [confirmingSubmit, setConfirmingSubmit] = useState(false)

  const validate = useValidateSchedule()
  const checkValidation = useCheckValidation()
  const submit = useSubmitSchedule()
  const pay = useInitiatePensionPayment()
  const syncPayment = useSyncPensionPayment()
  const isSettled = schedule.status === 'PAID' || schedule.status === 'DISBURSED'
  const disbursements = useScheduleDisbursements(schedule.id, isSettled)

  async function run(action: () => Promise<unknown>, success?: string) {
    setError(undefined)
    try {
      await action()
      if (success) notify.success(success)
    } catch (err) {
      setError(pensionErrorMessage(err))
    }
  }

  const sendForValidation = () =>
    run(async () => {
      setCheckedErrors([])
      await validate.mutateAsync(schedule.id)
    }, 'Sent to PenCentral for validation')

  const refreshValidation = () =>
    run(async () => {
      const result = await checkValidation.mutateAsync(schedule.id)
      setCheckedErrors(result.errors.length ? result.errors : result.schedule.validationErrors)
      if (result.penCentralStatus === 'pending') notify.success('PenCentral is still checking this schedule')
    })

  const submitSchedule = () =>
    run(async () => {
      await submit.mutateAsync(schedule.id)
      setConfirmingSubmit(false)
    }, 'Schedule submitted to PenCentral')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{schedule.employeeCount != null ? `${schedule.employeeCount} employees` : ''}</p>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <div className="divide-y divide-line rounded-lg border border-line bg-canvas px-3">
        <Row label="Employee contributions" value={naira(schedule.totalEmployeePension)} />
        <Row label="Employer contributions" value={naira(schedule.totalEmployerPension)} />
        <Row label="Total to remit" value={naira(schedule.totalAmount)} />
        {schedule.receiptId ? <Row label="PenCom receipt" value={schedule.receiptId} /> : null}
      </div>

      {error ? <FormErrorBanner message={error} /> : null}

      {validationErrors.length > 0 ? (
        <div className="rounded-lg border border-critical/40 bg-critical/5 px-3 py-2.5 text-sm">
          <p className="font-medium text-critical">PenCentral found problems with these rows</p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-ink">
            {validationErrors.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
          <p className="mt-2 text-muted">Fix the employees&apos; pension details, then send the schedule again.</p>
        </div>
      ) : null}

      {schedule.status === 'DRAFT' || schedule.status === 'VALIDATION_FAILED' ? (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            PenCentral checks every employee&apos;s RSA PIN and PFA with PenCom before the schedule can be filed.
          </p>
          <Button type="button" width="fit" className="px-5" loading={validate.isPending} onClick={sendForValidation}>
            {schedule.status === 'DRAFT' ? 'Send for validation' : 'Send for validation again'}
          </Button>
        </div>
      ) : null}

      {schedule.status === 'VALIDATING' ? (
        <div className="space-y-3">
          <p className="text-sm text-muted">PenCentral is checking this schedule. This can take a few minutes.</p>
          <Button
            type="button"
            variant="secondary"
            width="fit"
            className="px-5"
            loading={checkValidation.isPending}
            onClick={refreshValidation}
          >
            Check validation
          </Button>
        </div>
      ) : null}

      {schedule.status === 'VALIDATED' ? (
        confirmingSubmit ? (
          <div className="space-y-3 rounded-lg border border-line bg-canvas px-3 py-3">
            <p className="text-sm text-ink">
              Submit this schedule to PenCentral? It becomes your official filing for {schedule.periodLabel} and
              can&apos;t be changed afterwards.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" width="fit" className="px-5" onClick={() => setConfirmingSubmit(false)}>
                Not yet
              </Button>
              <Button type="button" width="fit" className="px-5" loading={submit.isPending} onClick={submitSchedule}>
                Submit schedule
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted">PenCom accepted every row. Submit it to file the remittance.</p>
            <Button type="button" width="fit" className="px-5" onClick={() => setConfirmingSubmit(true)}>
              Submit to PenCentral
            </Button>
          </div>
        )
      ) : null}

      {schedule.status === 'SUBMITTED' ? (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Get the account to pay {naira(schedule.totalAmount)} into. PenCentral splits it across each employee&apos;s
            PFA, so it&apos;s one transfer instead of one per PFA.
          </p>
          <Button
            type="button"
            width="fit"
            className="px-5"
            loading={pay.isPending}
            onClick={() => run(() => pay.mutateAsync(schedule.id))}
          >
            Get payment account
          </Button>
        </div>
      ) : null}

      {schedule.status === 'PAYMENT_PENDING' ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-accent/40 bg-accent/5 px-3 py-2.5 text-sm">
            <p className="text-muted">Transfer exactly {naira(schedule.totalAmount)} to</p>
            <p className="mt-1 text-lg font-medium tracking-wide text-ink">{schedule.virtualAccountNumber ?? '—'}</p>
            <p className="text-ink">
              {[schedule.virtualAccountBank, schedule.virtualAccountName].filter(Boolean).join(' · ') || '—'}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            width="fit"
            className="px-5"
            loading={syncPayment.isPending}
            onClick={() => run(() => syncPayment.mutateAsync(schedule.id))}
          >
            I&apos;ve paid, check payment
          </Button>
        </div>
      ) : null}

      {isSettled ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">Settlement with PFAs</p>
          {disbursements.isPending ? (
            <div className="h-20 animate-pulse rounded-lg bg-canvas" />
          ) : disbursements.isError ? (
            <p className="text-sm text-muted">Couldn&apos;t load the PFA breakdown: {pensionErrorMessage(disbursements.error)}</p>
          ) : disbursements.data.pfas.length === 0 ? (
            <p className="text-sm text-muted">PenCentral hasn&apos;t started paying the PFAs yet.</p>
          ) : (
            <ul className="divide-y divide-line rounded-lg border border-line">
              {disbursements.data.pfas.map((pfa) => (
                <li key={pfa.pfaCode || pfa.pfaName} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span className="min-w-0 truncate text-ink">{pfa.pfaName}</span>
                  <span className="shrink-0 text-muted">
                    {naira(pfa.creditedAmount)} of {naira(pfa.amount)} credited
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
