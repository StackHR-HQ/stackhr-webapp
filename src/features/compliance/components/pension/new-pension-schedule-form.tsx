import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '../../../../components/ui/button'
import { FormErrorBanner } from '../../../../components/ui/form-error-banner'
import { SelectField } from '../../../../components/ui/select-field'
import { notify } from '../../../../lib/toast'
import { usePayrollRuns } from '../../../payroll/hooks/use-payroll-runs'
import type { PayrollRunStage } from '../../../payroll/types/payroll-types'
import { IncompletePensionDetailsError, type IncompleteEmployee, type PensionSchedule } from '../../api/pension-api'
import { useCreateScheduleFromPayroll } from '../../hooks/use-pension'
import { missingFieldLabel, pensionErrorMessage } from '../../lib/pension-status'

// The backend builds schedules from approved or executed runs only.
const ELIGIBLE_STAGES: PayrollRunStage[] = ['APPROVED', 'FUNDING_CHECK_PASSED', 'EXECUTED', 'RECONCILED']

export function NewPensionScheduleForm({
  existingRunIds,
  onCreated,
  onCancel,
}: {
  existingRunIds: Set<string>
  onCreated: (schedule: PensionSchedule) => void
  onCancel: () => void
}) {
  const runs = usePayrollRuns()
  const create = useCreateScheduleFromPayroll()
  const [runId, setRunId] = useState('')
  const [error, setError] = useState<string>()
  const [incomplete, setIncomplete] = useState<IncompleteEmployee[]>([])

  const eligible = (runs.data ?? []).filter(
    (run) => run.stage && ELIGIBLE_STAGES.includes(run.stage) && !existingRunIds.has(run.id),
  )

  const submit = async () => {
    if (!runId) return
    setError(undefined)
    setIncomplete([])
    try {
      const schedule = await create.mutateAsync(runId)
      notify.success(`Draft schedule created for ${schedule.periodLabel}`)
      onCreated(schedule)
    } catch (err) {
      if (err instanceof IncompletePensionDetailsError) setIncomplete(err.employees)
      else setError(pensionErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        StackHR adds up each employee&apos;s 8% and the employer&apos;s 10% from the payroll run into a draft you can
        check before sending it to PenCentral.
      </p>

      {error ? <FormErrorBanner message={error} /> : null}

      {runs.isPending ? (
        <div className="h-16 animate-pulse rounded-lg bg-canvas" />
      ) : eligible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-sm text-muted">
          There&apos;s no approved payroll run without a schedule. Approve a payroll run first.
        </p>
      ) : (
        <SelectField
          id="payrollRunId"
          label="Payroll run"
          placeholder="Select a payroll run"
          value={runId}
          onChange={(event) => {
            setRunId(event.target.value)
            setIncomplete([])
          }}
          options={eligible.map((run) => ({ value: run.id, label: run.periodLabel }))}
        />
      )}

      {incomplete.length > 0 ? (
        <div className="rounded-lg border border-critical/40 bg-critical/5 px-3 py-2.5 text-sm">
          <p className="font-medium text-critical">
            {incomplete.length === 1 ? 'One employee is' : `${incomplete.length} employees are`} missing pension details
          </p>
          <ul className="mt-1.5 space-y-1">
            {incomplete.map((employee) => (
              <li key={employee.employeeId || employee.fullName} className="flex flex-wrap justify-between gap-x-3">
                {employee.employeeId ? (
                  <Link to={`/people/employees/${employee.employeeId}`} className="text-accent hover:underline">
                    {employee.fullName}
                  </Link>
                ) : (
                  <span className="text-ink">{employee.fullName}</span>
                )}
                <span className="text-muted">No {employee.missing.map(missingFieldLabel).join(' or ')}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-muted">Add the missing details, then create the schedule again.</p>
        </div>
      ) : null}

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" width="fit" className="px-6" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" width="fit" className="px-6" disabled={!runId} loading={create.isPending} onClick={submit}>
          Create draft
        </Button>
      </div>
    </div>
  )
}
