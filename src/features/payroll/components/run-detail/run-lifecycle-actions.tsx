import { isAxiosError } from 'axios'
import { useRef, useState } from 'react'
import { Button } from '../../../../components/ui/button'
import { Modal } from '../../../../components/ui/modal'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import {
  useAttestPayrollFunding,
  useCalculatePayrollRun,
  useExecutePayrollRun,
  useReconcilePayrollRun,
  useSubmitPayrollRun,
} from '../../hooks/use-payroll-run-actions'
import { formatAmount } from '../../lib/format'
import type { PayrollRunDetail } from '../../types/payroll-types'

const NEXT_STEP: Partial<Record<NonNullable<PayrollRunDetail['stage']>, string>> = {
  DRAFT: "Calculate the run to work out each employee's pay.",
  CALCULATED: 'Review the figures, then submit the run for approval.',
  APPROVED: 'Confirm the paying account holds enough to cover net pay.',
  FUNDING_SHORTFALL: 'Fund the account, then confirm funding again.',
  FUNDING_CHECK_PASSED: 'Funding is confirmed. Pay employees to export the bank transfer file.',
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

  async function pay() {
    idempotencyKey.current ??= crypto.randomUUID()
    try {
      await execute.mutateAsync({ id: run.id, idempotencyKey: idempotencyKey.current })
      idempotencyKey.current = null
      notify.success('Payment recorded', 'The bank transfer file has been exported.')
      onClose()
    } catch (err) {
      // A definite answer other than "still in progress" ends this attempt.
      if (isAxiosError(err) && err.response && err.response.status !== 409) idempotencyKey.current = null
      notify.error("Couldn't pay employees", getApiErrorMessage(err))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Pay employees">
      <p className="text-sm text-muted">
        This records payment of{' '}
        <span className="font-medium text-ink">{formatAmount(run.summary.netPay, run.summary.currency)}</span> to{' '}
        {run.summary.employeeCount} {run.summary.employeeCount === 1 ? 'employee' : 'employees'} for {run.periodLabel}{' '}
        and exports the bank transfer file. It can't be undone.
      </p>

      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="secondary" width="fit" className="px-4" disabled={execute.isPending} onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" width="fit" className="px-4" loading={execute.isPending} onClick={pay}>
          Pay employees
        </Button>
      </div>
    </Modal>
  )
}
