import { isAxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../../components/ui/button'
import { Modal } from '../../../../components/ui/modal'
import { csvCell, downloadCsv } from '../../../../lib/download'
import { USE_MOCK_PAYROLL } from '../../../../lib/env'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { AccountDetails, RefreshBalanceButton } from '../../../banking/components/deposit-account-card'
import { useDepositAccount, useSyncDepositAccount } from '../../../banking/hooks/use-banks'
import {
  useAttestPayrollFunding,
  useCalculatePayrollRun,
  useExecutePayrollRun,
  useReconcilePayrollRun,
  useSubmitPayrollRun,
} from '../../hooks/use-payroll-run-actions'
import { formatAmount } from '../../lib/format'
import type { PayrollExecution, PayrollRunDetail } from '../../types/payroll-types'

const NEXT_STEP: Partial<Record<NonNullable<PayrollRunDetail['stage']>, string>> = {
  DRAFT: "Calculate the run to work out each employee's pay.",
  CALCULATED: 'Review the figures, then submit the run for approval.',
  APPROVED: 'Confirm the paying account holds enough to cover net pay.',
  FUNDING_SHORTFALL: 'Fund the account, then confirm funding again.',
  FUNDING_CHECK_PASSED: 'Funding is confirmed. Pay employees from the company account.',
  EXECUTED: 'Once every transfer has landed, mark the run as reconciled.',
}

// The step that moves a backend run forward. Approval is handled by RunApprovalActions.
export function RunLifecycleActions({ run }: { run: PayrollRunDetail }) {
  const calculate = useCalculatePayrollRun()
  const submit = useSubmitPayrollRun()
  const reconcile = useReconcilePayrollRun()
  const [dialog, setDialog] = useState<'funding' | 'execute' | null>(null)

  const hint = run.stage ? NEXT_STEP[run.stage] : undefined
  if (!hint) return null

  async function runStep(step: () => Promise<void>, success: string, failure: string) {
    try {
      await step()
      notify.success(success)
    } catch (err) {
      notify.error(failure, getApiErrorMessage(err))
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <p className="max-w-xs text-right text-xs text-muted">{hint}</p>

      {run.stage === 'DRAFT' ? (
        <Button
          type="button"
          width="fit"
          className="px-4"
          loading={calculate.isPending}
          onClick={() => runStep(() => calculate.mutateAsync(run.id), 'Payroll calculated', "Couldn't calculate payroll")}
        >
          Calculate payroll
        </Button>
      ) : null}

      {run.stage === 'CALCULATED' ? (
        <Button
          type="button"
          width="fit"
          className="px-4"
          loading={submit.isPending}
          onClick={() =>
            runStep(() => submit.mutateAsync(run.id), 'Submitted for approval', "Couldn't submit the run for approval")
          }
        >
          Submit for approval
        </Button>
      ) : null}

      {run.stage === 'APPROVED' || run.stage === 'FUNDING_SHORTFALL' ? (
        <Button type="button" width="fit" className="px-4" onClick={() => setDialog('funding')}>
          Confirm funding
        </Button>
      ) : null}

      {run.stage === 'FUNDING_CHECK_PASSED' ? (
        <Button type="button" width="fit" className="px-4" onClick={() => setDialog('execute')}>
          Pay employees
        </Button>
      ) : null}

      {run.stage === 'EXECUTED' ? (
        <Button
          type="button"
          width="fit"
          className="px-4"
          loading={reconcile.isPending}
          onClick={() =>
            runStep(() => reconcile.mutateAsync(run.id), 'Payroll run reconciled', "Couldn't reconcile the run")
          }
        >
          Mark as reconciled
        </Button>
      ) : null}

      <FundingCheckModal run={run} open={dialog === 'funding'} onClose={() => setDialog(null)} />
      <ExecuteRunModal run={run} open={dialog === 'execute'} onClose={() => setDialog(null)} />
    </div>
  )
}

const toKobo = (amount: number) => Math.round(amount * 100)

// Shows the company account next to the net pay it has to cover, so the admin
// confirms funding against the real balance. The GET returns the last-synced
// balance, so the live one is fetched from Anchor when this opens.
function FundingStatus({ run }: { run: PayrollRunDetail }) {
  const account = useDepositAccount(!USE_MOCK_PAYROLL)
  const sync = useSyncDepositAccount()
  const { mutate: syncBalance } = sync
  // Strict mode mounts twice in dev; one sync per opening is enough.
  const synced = useRef(false)

  useEffect(() => {
    if (USE_MOCK_PAYROLL || synced.current) return
    synced.current = true
    syncBalance()
  }, [syncBalance])

  // Mock runs have mock net pay, so comparing them to a real balance means nothing.
  if (USE_MOCK_PAYROLL) return null
  if (account.isPending) return <div className="mt-4 h-24 animate-pulse rounded-lg bg-canvas" />
  if (account.isError) return null

  const { currency } = run.summary
  const sameCurrency = account.data.currency === currency
  const shortfallKobo = toKobo(run.summary.netPay) - toKobo(account.data.balance)

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Company account</p>
        <RefreshBalanceButton />
      </div>
      <AccountDetails account={account.data} />
      {sync.isPending ? (
        <p className="rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-muted">Checking the live balance…</p>
      ) : (
        <>
          {sync.isError ? (
            <p className="text-xs text-muted">
              Couldn&apos;t fetch the live balance, so this is the last one recorded. Refresh before confirming.
            </p>
          ) : null}
          {!sameCurrency ? (
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-ink">
              The company account holds {account.data.currency}, but this run pays in {currency}. Check the balance
              covers net pay before confirming.
            </p>
          ) : shortfallKobo > 0 ? (
            <p className="rounded-lg border border-critical/40 bg-critical/5 px-3 py-2 text-sm text-critical">
              {/* Rounded up, so a shortfall of a few kobo never reads as ₦0. */}
              Short by {formatAmount(Math.ceil(shortfallKobo / 100), currency)}. Transfer at least that much, then
              refresh the balance.
            </p>
          ) : (
            <p className="rounded-lg border border-positive/40 bg-positive/5 px-3 py-2 text-sm text-positive">
              The balance covers this run&apos;s net pay.
            </p>
          )}
        </>
      )}
    </div>
  )
}

function FundingCheckModal({ run, open, onClose }: { run: PayrollRunDetail; open: boolean; onClose: () => void }) {
  const attest = useAttestPayrollFunding()
  const [notes, setNotes] = useState('')
  const [answer, setAnswer] = useState<boolean | null>(null)

  async function record(confirmed: boolean) {
    setAnswer(confirmed)
    try {
      await attest.mutateAsync({ id: run.id, confirmed, notes: notes.trim() || undefined })
      notify.success(confirmed ? 'Funding confirmed' : 'Funding shortfall recorded')
      setNotes('')
      onClose()
    } catch (err) {
      notify.error("Couldn't record the funding check", getApiErrorMessage(err))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Confirm funding">
      <p className="text-sm text-muted">
        Check that the account paying salaries holds at least{' '}
        <span className="font-medium text-ink">{formatAmount(run.summary.netPay, run.summary.currency)}</span>, the net
        pay for {run.summary.employeeCount} {run.summary.employeeCount === 1 ? 'employee' : 'employees'}.
      </p>

      {open ? <FundingStatus run={run} /> : null}

      <label htmlFor="funding-notes" className="mt-4 mb-1.5 block text-sm font-medium text-ink">
        Notes <span className="font-normal text-muted">(optional)</span>
      </label>
      <textarea
        id="funding-notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="e.g. Balance verified on the bank portal"
        rows={3}
        className="w-full resize-y rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />

      <div className="mt-5 flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          width="fit"
          className="px-4"
          loading={attest.isPending && answer === false}
          disabled={attest.isPending}
          onClick={() => record(false)}
        >
          Report shortfall
        </Button>
        <Button
          type="button"
          width="fit"
          className="px-4"
          loading={attest.isPending && answer === true}
          disabled={attest.isPending}
          onClick={() => record(true)}
        >
          Funds are available
        </Button>
      </div>
    </Modal>
  )
}

function ExecuteRunModal({ run, open, onClose }: { run: PayrollRunDetail; open: boolean; onClose: () => void }) {
  const execute = useExecutePayrollRun()
  // One key per payment attempt, kept across retries so a resent request
  // replays the first one instead of paying twice.
  const idempotencyKey = useRef<string | null>(null)
  // A double-click lands before the button re-renders as disabled.
  const inFlight = useRef(false)
  // The run doesn't keep this, so it's shown now or not at all.
  const [result, setResult] = useState<PayrollExecution | null>(null)

  async function pay() {
    if (inFlight.current) return
    inFlight.current = true
    idempotencyKey.current ??= crypto.randomUUID()
    try {
      const execution = await execute.mutateAsync({ id: run.id, idempotencyKey: idempotencyKey.current })
      idempotencyKey.current = null
      setResult(execution)
      const outcome = executionOutcome(execution)
      if (outcome === 'failed') notify.error('Salary transfers failed', 'Pay each employee by bank transfer instead.')
      else if (outcome === 'manual') notify.success('Payment recorded', 'Pay each employee by bank transfer.')
      else notify.success(outcome === 'completed' ? 'Employees paid' : 'Salary transfers sent')
    } catch (err) {
      // A definite answer other than "still in progress" ends this attempt.
      if (isAxiosError(err) && err.response && err.response.status !== 409) idempotencyKey.current = null
      notify.error("Couldn't pay employees", getApiErrorMessage(err))
    } finally {
      inFlight.current = false
    }
  }

  function close() {
    setResult(null)
    onClose()
  }

  return (
    // The result isn't kept anywhere else, so only Done closes it; while paying,
    // closing would hide the result when it arrives.
    <Modal
      open={open}
      onClose={close}
      dismissible={!execute.isPending && !result}
      title={result ? RESULT_TITLE[executionOutcome(result)] : 'Pay employees'}
    >
      {result ? (
        <ExecutionResult run={run} result={result} onDone={close} />
      ) : (
        <>
          <p className="text-sm text-muted">
            This pays{' '}
            <span className="font-medium text-ink">{formatAmount(run.summary.netPay, run.summary.currency)}</span> to{' '}
            {run.summary.employeeCount} {run.summary.employeeCount === 1 ? 'employee' : 'employees'} for{' '}
            {run.periodLabel} from the company account, by bank transfer. It can&apos;t be undone.
          </p>

          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="secondary" width="fit" className="px-4" disabled={execute.isPending} onClick={close}>
              Cancel
            </Button>
            <Button type="button" width="fit" className="px-4" loading={execute.isPending} onClick={pay}>
              Pay employees
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}

const TRANSFER_STATUS: Record<string, string> = {
  PROCESSING: 'Processing',
  PENDING: 'Processing',
  SUCCESSFUL: 'Completed',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
}

type ExecutionOutcome = 'completed' | 'processing' | 'failed' | 'manual'

// What happened to the money: sent by Anchor (and how far it got), or left
// for the admin to pay by hand.
function executionOutcome({ bulkTransfer }: PayrollExecution): ExecutionOutcome {
  if (!bulkTransfer) return 'manual'
  const status = TRANSFER_STATUS[bulkTransfer.status.toUpperCase()]
  if (status === 'Failed') return 'failed'
  return status === 'Completed' ? 'completed' : 'processing'
}

const RESULT_TITLE: Record<ExecutionOutcome, string> = {
  completed: 'Employees paid',
  processing: 'Salary transfers sent',
  failed: 'Salary transfers failed',
  manual: 'Pay employees by bank transfer',
}

function downloadTransfers(run: PayrollRunDetail, result: PayrollExecution) {
  const rows = [
    ['Employee', 'Amount', 'Currency'],
    ...result.transfers.map((transfer) => [transfer.employeeName, transfer.amount, transfer.currency]),
  ]
  downloadCsv(
    rows.map((row) => row.map(csvCell).join(',')).join('\n'),
    `payroll-transfers-${run.periodLabel.replace(/\s+/g, '-').toLowerCase()}.csv`,
  )
}

function ExecutionResult({ run, result, onDone }: { run: PayrollRunDetail; result: PayrollExecution; onDone: () => void }) {
  const { bulkTransfer } = result
  const failed = executionOutcome(result) === 'failed'
  return (
    <div className="space-y-4">
      {bulkTransfer ? (
        <div
          className={`space-y-1 rounded-lg border px-3 py-2.5 text-sm ${failed ? 'border-critical/40 bg-critical/5' : 'border-line bg-canvas'}`}
        >
          <p className="text-ink">
            {bulkTransfer.transfersCount} {bulkTransfer.transfersCount === 1 ? 'transfer' : 'transfers'} totalling{' '}
            <span className="font-medium">{formatAmount(bulkTransfer.totalAmount, run.summary.currency)}</span>{' '}
            {failed
              ? "couldn't be sent from the company account. Pay each employee by bank transfer using the list below."
              : 'sent from the company account.'}
          </p>
          <p className={failed ? 'text-critical' : 'text-muted'}>
            Status: {TRANSFER_STATUS[bulkTransfer.status.toUpperCase()] ?? bulkTransfer.status} · Reference{' '}
            {bulkTransfer.reference}
          </p>
        </div>
      ) : (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-sm text-ink">
          The payment is recorded, but the transfers weren&apos;t sent automatically. Pay each employee by bank transfer
          using the list below.
        </p>
      )}

      {result.transfers.length > 0 ? (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-sm font-medium text-ink">
              {result.transfers.length} {result.transfers.length === 1 ? 'payout' : 'payouts'} ·{' '}
              {formatAmount(result.totalNet, run.summary.currency)}
            </p>
            <button
              type="button"
              onClick={() => downloadTransfers(run, result)}
              className="text-xs font-medium text-accent hover:underline"
            >
              Download CSV
            </button>
          </div>
          <ul className="max-h-56 divide-y divide-line overflow-y-auto rounded-lg border border-line">
            {result.transfers.map((transfer, index) => (
              <li key={`${transfer.employeeName}-${index}`} className="flex justify-between gap-3 px-3 py-2 text-sm">
                <span className="truncate text-ink">{transfer.employeeName}</span>
                <span className="shrink-0 text-muted">{formatAmount(transfer.amount, transfer.currency)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-xs text-muted">Once every transfer has landed, mark the run as reconciled.</p>
      <div className="flex justify-end">
        <Button type="button" width="fit" className="px-5" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  )
}
